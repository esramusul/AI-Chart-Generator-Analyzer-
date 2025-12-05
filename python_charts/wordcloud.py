import utils
import matplotlib.pyplot as plt
from wordcloud import WordCloud

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(10, 6))

text_col = args.x # assume x used for text column
if not text_col:
    # try to find object column
    cats = df.select_dtypes(include='object').columns
    if len(cats) > 0:
        text_col = cats[0]

if text_col:
    text = " ".join(str(x) for x in df[text_col].dropna())
    wordcloud = WordCloud(width=800, height=400, background_color ='white').generate(text)
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis("off")
    plt.title(f'Word Cloud from {text_col}')
else:
    plt.text(0.5, 0.5, 'No text column found', ha='center')

utils.save_plot(plt, args.output)
