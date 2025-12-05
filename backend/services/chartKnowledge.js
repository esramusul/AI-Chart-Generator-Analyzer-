const fs = require('fs');
const path = require('path');

const knowledgePath = path.join(__dirname, '..', 'chartKnowledge.json');
let chartKnowledge = [];

try {
    const data = fs.readFileSync(knowledgePath, 'utf8');
    chartKnowledge = JSON.parse(data);
    console.log('Chart knowledge loaded successfully.');
} catch (err) {
    console.error('Error reading chartKnowledge.json:', err);
}

function parseRule(rule, actualCount) {
    // rule examples: ">= 1", "1", "2", ">= 0"
    if (!rule) return true; // No rule implies it's okay? Or logic error. Assuming optional if missing.

    const cleanRule = rule.trim();
    if (cleanRule.startsWith('>=')) {
        const target = parseInt(cleanRule.replace('>=', '').trim(), 10);
        return actualCount >= target;
    } else if (cleanRule.startsWith('<=')) {
        const target = parseInt(cleanRule.replace('<=', '').trim(), 10);
        return actualCount <= target;
    } else if (cleanRule.startsWith('>')) {
        const target = parseInt(cleanRule.replace('>', '').trim(), 10);
        return actualCount > target;
    } else if (cleanRule.startsWith('<')) {
        const target = parseInt(cleanRule.replace('<', '').trim(), 10);
        return actualCount < target;
    } else {
        // Direct equality "1", "2"
        const target = parseInt(cleanRule, 10);
        return actualCount === target;
    }
}

function suggestChartsFromSchema(schema) {
    // schema = { numericColumns: [], categoricalColumns: [], datetimeColumns: [], geospatialData: [] }
    const numCount = schema.numericColumns ? schema.numericColumns.length : 0;
    const catCount = schema.categoricalColumns ? schema.categoricalColumns.length : 0;
    const dateCount = schema.datetimeColumns ? schema.datetimeColumns.length : 0;
    const geoCount = schema.geospatialData ? schema.geospatialData.length : 0;

    const suggestions = [];

    chartKnowledge.forEach(category => {
        category.charts.forEach(chart => {
            const rules = chart.suitableDataSchema;
            if (!rules) return;

            // Check each rule
            const numMatch = parseRule(rules.numericColumns, numCount);
            const catMatch = parseRule(rules.categoricalColumns, catCount);
            const dateMatch = parseRule(rules.datetimeColumns, dateCount);

            // Optional geospatial check
            let geoMatch = true;
            if (rules.geospatialData) {
                geoMatch = parseRule(rules.geospatialData, geoCount);
            }

            if (numMatch && catMatch && dateMatch && geoMatch) {
                suggestions.push({
                    category: category.category,
                    ...chart
                });
            }
        });
    });

    return suggestions;
}

module.exports = {
    chartKnowledge,
    suggestChartsFromSchema
};
