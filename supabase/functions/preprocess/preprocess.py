import pandas as pd
import numpy as np
import json
import os

def load_dataframes(files_info):
    """
    Load files into pandas DataFrames
    """
    dataframes = {}
    for file_info in files_info:
        file_path = file_info['file_path']
        file_name = file_info['file_name']
        df_name = os.path.splitext(file_name)[0]
        
        try:
            if file_path.lower().endswith('.csv'):
                df = pd.read_csv(file_path)
            elif file_path.lower().endswith(('.xls', '.xlsx')):
                df = pd.read_excel(file_path)
            else:
                print(f"Unsupported file format for {file_name}")
                continue
                
            dataframes[df_name] = df
            print(f"Successfully loaded {file_name} into DataFrame {df_name}")
        except Exception as e:
            print(f"Error loading {file_name}: {str(e)}")
            
    return dataframes

def preprocess_dataframe(df):
    """
    Basic preprocessing steps for each DataFrame
    """
    # Remove duplicate rows
    df = df.drop_duplicates()
    
    # Handle missing values
    numeric_columns = df.select_dtypes(include=[np.number]).columns
    df[numeric_columns] = df[numeric_columns].fillna(df[numeric_columns].mean())
    
    # Fill remaining NaN values with 'Unknown' for non-numeric columns
    df = df.fillna('Unknown')
    
    return df

def main():
    try:
        # Get files information from environment or command line
        files_info = json.loads(os.environ.get('FILES_INFO', '[]'))
        
        # Load all dataframes
        dataframes = load_dataframes(files_info)
        
        # Process each dataframe
        results = {}
        for name, df in dataframes.items():
            # Preprocess the dataframe
            processed_df = preprocess_dataframe(df)
            
            # Store results
            results[name] = {
                'original_shape': df.shape,
                'processed_shape': processed_df.shape,
                'columns': list(processed_df.columns),
                'summary_stats': processed_df.describe().to_dict(),
                'missing_values': processed_df.isnull().sum().to_dict()
            }
            
            # Save processed dataframe
            output_path = f"processed_{name}.csv"
            processed_df.to_csv(output_path, index=False)
            print(f"Saved processed data to {output_path}")
        
        # Print results as JSON for the Edge Function to parse
        print(json.dumps(results))
        
    except Exception as e:
        print(json.dumps({
            'error': str(e),
            'status': 'failed'
        }))

if __name__ == "__main__":
    main()