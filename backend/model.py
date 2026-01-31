import random
import re
import pandas as pd
from joblib import load

class BudgetClassifier:
    def __init__(self):
        self.model = None
        self.categories = [
            "Food & Dining",
            "Transportation",
            "Utilities",
            "Entertainment",
            "Shopping",
            "Health & Fitness",
            "Travel",
            "Personal Care",
            "Education",
            "Investments"
        ]

    def load_models(self, model_path: str = None):
        """
        Load the ML model and related artifacts.
        """
        print(f"Loading model from `{model_path}`")
        self.model = load(f'{model_path}/model.joblib')
        self.tfidf = load(f'{model_path}/tfidf.joblib')
        self.id_to_category = load(f'{model_path}/id_to_category.joblib')

    def parse_expenses(self, text: str) -> pd.DataFrame:
        """
        Parses a string of expenses and returns a DataFrame.
        Expected format:
        - 1/20 $57.80 feetures socks 
        - 1/21 +$5 Venmo from Bing for lunch
        
        Returns a DataFrame with columns ['date', 'cost', 'desc'].
        'cost' is positive for expenses, negative for income (marked with +).
        """
        data = []
        lines = text.strip().split('\n')
        
        # Regex to capture:
        # 1. Date (e.g. 1/20)
        # 2. Cost/Amount (e.g. $57.80 or +$5)
        # 3. Description (rest of line)
        pattern = re.compile(r'-\s+(\d+/\d+)\s+([+\-]?\$?[\d,.]+)\s+(.*)')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            match = pattern.match(line)
            if match:
                date_str = match.group(1)
                amount_raw = match.group(2)
                desc = match.group(3)
                
                # process amount
                clean_amount = amount_raw.replace('$', '').replace(',', '')
                try:
                    val = float(clean_amount)
                    # Heuristic: if it has a '+' sign in original string, treat as income (negative cost)
                    # But float('+5') is 5. If we want it to be negative cost:
                    if '+' in amount_raw:
                        val = -val  # Income
                    # Else leave as positive (Cost)
                except ValueError:
                    val = 0.0
                    
                data.append({'date': date_str, 'cost': val, 'desc': desc})
                
        return pd.DataFrame(data, columns=['date', 'cost', 'desc'])

    def predict(self, user_txt: str) -> list[dict]:
        '''
        Predict the category for each line in the input text.
        '''
        df = self.parse_expenses(user_txt)
        tfidf_desc = self.tfidf.transform(df['desc'])
        predicted_codes = self.model.predict(tfidf_desc)
        predicted_categories = [self.id_to_category[c] for c in predicted_codes]
        df['category'] = predicted_categories

        df = df[['date', 'category', 'cost', 'desc']]
        return df.to_dict(orient='records')

# Singleton instance
classifier = BudgetClassifier()
