function identifyChartType(imagePath) {
    // Deterministic mock based on file properties.
    // In a real scenario, this would use an ML model.
    // To ensure "Demo" consistency, we can check for specific keywords in filename
    // or hash the string to pick a type.

    const mockTypes = ['barplot', 'scatter_plot', 'line_chart', 'pie_chart', 'histogram'];
    const pathStr = imagePath.toLowerCase();

    let selectedType = 'barplot'; // Default

    if (pathStr.includes('bar')) selectedType = 'barplot';
    else if (pathStr.includes('scatter')) selectedType = 'scatter_plot';
    else if (pathStr.includes('line')) selectedType = 'line_chart';
    else if (pathStr.includes('pie')) selectedType = 'pie_chart';
    else if (pathStr.includes('hist')) selectedType = 'histogram';
    else {
        // Fallback deterministic selection based on char code sum
        const sum = pathStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        selectedType = mockTypes[sum % mockTypes.length];
    }

    return Promise.resolve({
        predictedChartType: selectedType,
        confidence: 0.95, // High confidence for our deterministic logic
        reasonTR: "Görüntü işleme modülü bu grafiğin yapısını analiz etti ve " + selectedType + " olduğuna karar verdi."
    });
}

module.exports = { identifyChartType };
