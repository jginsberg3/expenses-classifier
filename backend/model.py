import random

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

    def load_model(self, model_path: str = None):
        """
        Mock loading of the model.
        In the future, this will load the actual .joblib or .pkl file.
        """
        print(f"Loading model from {model_path} (MOCKED)")
        self.model = True # Dummy flag

    def predict(self, text: str) -> str:
        """
        Mock prediction logic.
        Returns a consistent category based on hashing the text, 
        so the same input gives the same output (useful for testing).
        """
        if not self.model:
            # Auto-load if not loaded (or raise error)
            self.load_model()
        
        # Simple deterministic mock based on hash
        index = hash(text) % len(self.categories)
        return self.categories[index]

# Singleton instance
classifier = BudgetClassifier()
