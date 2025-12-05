import argparse
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import sys
import os

def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True, help='Input data file (CSV/XLSX)')
    parser.add_argument('--output', required=True, help='Output PNG file')
    parser.add_argument('--x', help='Column for X axis')
    parser.add_argument('--y', help='Column for Y axis')
    parser.add_argument('--group', help='Column for grouping/hue')
    parser.add_argument('--size', help='Column for size')
    parser.add_argument('--color', help='Column for color')
    return parser.parse_args()

def load_data(input_path):
    if not os.path.exists(input_path):
        print(f"Error: File {input_path} not found")
        sys.exit(1)
        
    if input_path.endswith('.csv'):
        return pd.read_csv(input_path)
    elif input_path.endswith('.xlsx'):
        return pd.read_excel(input_path)
    else:
        print("Error: Unsupported file format")
        sys.exit(1)

def save_plot(plt, output_path):
    plt.savefig(output_path, bbox_inches='tight', dpi=300)
    print(f"Chart saved to {output_path}")
