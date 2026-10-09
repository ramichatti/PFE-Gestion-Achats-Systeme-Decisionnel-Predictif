import pyodbc
import pandas as pd
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime

# Chaîne de connexion à la base de données
connection_DW = 'DRIVER={SQL Server};SERVER=LAPTOP-NKB7UOMN;DATABASE=DW_APP_ACHAT;UID=sa;PWD=Mo22912604'

# Requête SQL pour charger les données depuis votre entrepôt de données
query = """
SELECT 
    [Document_Type],
    [Document_Id],
    [Document_Line_id],
    [utilisateur_fk],
    [fournisseur_fk],
    [produit_fk],
    [avis],
    [date_fk],
    [quantite],
    [prix_unitaire],
    [tva],
    [remise],
    [montant_ht],
    [ttc],
    [montant_tva],
    [Montant_Total],
    [status]
FROM 
    [DW_APP_ACHAT].[dbo].[Fact_Achat]
WHERE 
    [Document_Type] = 'Commande'
"""

query_dim_produit = """
SELECT [Id]
      ,[nom]
      ,[reference]
      ,[categorie]
      ,[description]
  FROM [DW_APP_ACHAT].[dbo].[Dim_Produit]
"""

# Connexion à la base de données
conn = pyodbc.connect(connection_DW)

# Chargement des données dans un DataFrame pandas
data = pd.read_sql(query, conn)

# Chargement des données de la table Dim_Produit dans un DataFrame pandas
dim_produit_data = pd.read_sql(query_dim_produit, conn)

# Chargement des données dans un DataFrame pandas
data = pd.read_sql(query, conn)

# Fermeture de la connexion
conn.close()

# Extraction de l'année et du mois à partir de la clé de date (datekey)
data['Year'] = data['date_fk'].astype(str).str[:4]
data['Month'] = data['date_fk'].astype(str).str[4:6]

# Groupement des données par année et par mois, puis calcul de la somme du montant total pour chaque groupe
total_by_year_month = data.groupby(['Year', 'Month', 'Document_Id'])['Montant_Total'].sum().reset_index()

# Somme des montants totaux par année et par mois
sum_by_year_month = total_by_year_month.groupby(['Year', 'Month'])['Montant_Total'].sum().reset_index()

# Création d'un DataFrame pour afficher les montants totaux par année et par mois
# Création d'un DataFrame en arrondissant les valeurs de la colonne Total_Montant
sum_by_year_month_df = pd.DataFrame({'Year': sum_by_year_month['Year'], 
                                     'Month': sum_by_year_month['Month'], 
                                     'Total_Montant': sum_by_year_month['Montant_Total'].round()})

# Formater la colonne Total_Montant pour afficher .000000 même pour les valeurs entières
sum_by_year_month_df['Total_Montant'] = sum_by_year_month_df['Total_Montant'].astype(str) + ".000000"

# Extraire le nombre avant le point décimal
sum_by_year_month_df['Total_Montant'] = sum_by_year_month_df['Total_Montant'].apply(lambda x: x.split('.')[0])

# Affichage du DataFrame avec les montants totaux par année et par mois
print(sum_by_year_month_df)

# Affichage du DataFrame avec les montants totaux par année et par mois
print(sum_by_year_month_df)

# Affichage du DataFrame avec les montants totaux par année et par mois
print(sum_by_year_month_df)

# Variables indépendantes (X) et variable cible (y) pour la régression linéaire
X = sum_by_year_month_df[['Year', 'Month']]  # Utilisez 'Year' et 'Month' comme variables indépendantes
y = sum_by_year_month_df['Total_Montant']  # Utilisez 'Total_Montant' comme variable cible

# Création d'un modèle de régression linéaire
model = LinearRegression()

# Entraînement du modèle
model.fit(X, y) 

# Convertir la colonne 'Month' en entier
sum_by_year_month_df['Month'] = sum_by_year_month_df['Month'].astype(int)
# print(sum_by_year_month_df['Month'])

# Convertir la colonne 'Year' en entier
sum_by_year_month_df['Year'] = sum_by_year_month_df['Year'].astype(int)
# print(sum_by_year_month_df['Year'])

# Prédiction pour le mois suivant
if (sum_by_year_month_df['Year'].max() & sum_by_year_month_df['Month'].max()) == 12:  # Si le mois le plus élevé est décembre
    next_year = sum_by_year_month_df['Year'].max() + 1  # L'année suivante
    next_month = 1  # Le mois suivant est janvier
else:
    next_year = sum_by_year_month_df['Year'].max()  # L'année actuelle
    next_month = sum_by_year_month_df[sum_by_year_month_df['Year'] == next_year]['Month'].max() + 1 # Le mois suivant
    print(next_month)

next_month_prediction = model.predict([[next_year, next_month]])

# Affichage de la prédiction pour le mois suivant
print("Prédiction pour le mois suivant (", next_year, "/", next_month, "):", abs(next_month_prediction))


# Création d'une DataFrame pour stocker la prédiction
prediction_df = pd.DataFrame({'Year': [next_year], 
                              'Month': [next_month], 
                              'Total_Montant': [abs(next_month_prediction[0])]})

# Arrondir la valeur de Total_Montant
prediction_df['Total_Montant'] = prediction_df['Total_Montant'].round()

# Formater la colonne Total_Montant pour afficher .000000 même pour les valeurs entières
prediction_df['Total_Montant'] = prediction_df['Total_Montant'].astype(str) + ".000000"

# Extraire le nombre avant le point décimal
prediction_df['Total_Montant'] = prediction_df['Total_Montant'].apply(lambda x: x.split('.')[0])

# Affichage de la DataFrame mise à jour
print(prediction_df)

# Concaténation des DataFrames sum_by_year_month_df et prediction_df
charges_prediction = pd.concat([sum_by_year_month_df, prediction_df], ignore_index=True)

# Affichage de la DataFrame combinée
print(charges_prediction)

# # Création de l'histogramme
# plt.bar(range(len(sum_by_year_month_df['Total_Montant'])), sum_by_year_month_df['Total_Montant'], color='blue', alpha=0.5, label='CHARGES  MOIS')
# plt.xlabel('ANNÉE / MOIS')
# plt.ylabel('CHARGES')
# plt.title('CHARGES PAR ANNÉE / MOIS')

# # Afficher les valeurs exactes au sommet de chaque barre (arrondies)
# for i, value in enumerate(sum_by_year_month_df['Total_Montant']):
#     plt.text(i, value, str(round(value)), ha='center', va='bottom', rotation=0)

# # Afficher la valeur prédite au-dessus de la ligne de prédiction
# plt.text(len(sum_by_year_month_df['Total_Montant'])-1, next_month_prediction, str(round(next_month_prediction[0])), ha='center', va='bottom', color='red', rotation=0)

# # Formatter les étiquettes de l'axe x pour afficher le format "Année-Mois"
# formatted_dates = [datetime(int(year), int(month), 1).strftime("%Y/%m") for year, month in zip(sum_by_year_month_df['Year'], sum_by_year_month_df['Month'])]
# plt.xticks(range(len(sum_by_year_month_df['Total_Montant'])), formatted_dates, rotation=0)
# plt.axhline(y=next_month_prediction, color='red', linestyle='--', label='PRÉDICTION POUR LE MOIS SUIVANT')
# plt.legend()
# plt.tight_layout()  # Ajustement automatique de la disposition pour éviter le chevauchement
# plt.show()


# Variables indépendantes (X) et variable cible (y) pour la régression linéaire par produit
X_product_quantite = data[['Year', 'Month', 'produit_fk']]  # Utilisez 'Year', 'Month' et 'produit_fk' comme variables indépendantes
y_product_quantite = data['quantite']  # Utilisez 'quantite' comme variable cible

# Initialisation d'un dictionnaire pour stocker les prédictions de quantité par produit
predictions_data = {'Produit': [], 'Quantité_Predicted': []}

# Entraînement et prédiction pour chaque produit
for product in data['produit_fk'].unique():
    # Filtrer les données pour le produit actuel
    product_data = data[data['produit_fk'] == product]
    
    # Création d'un modèle de régression linéaire pour chaque produit
    model_product = LinearRegression()
    
    # Entraînement du modèle pour chaque produit
    model_product.fit(product_data[['Year', 'Month']], product_data['quantite']) 
    
    # Prédiction pour le mois suivant pour chaque produit
    next_month_product_quantite_prediction = model_product.predict([[next_year, next_month]])

    # Ajustement des prédictions négatives à zéro
    next_month_product_quantite_prediction = max(0, next_month_product_quantite_prediction)

    # Stockage de la prédiction pour chaque produit dans le dictionnaire
    predictions_data['Produit'].append(product)
    predictions_data['Quantité_Predicted'].append(next_month_product_quantite_prediction)

# Conversion du dictionnaire en DataFrame
predictions_df = pd.DataFrame(predictions_data)

# Supprimer les crochets et convertir les valeurs en entier
predictions_df['Quantité_Predicted'] = predictions_df['Quantité_Predicted'].astype(int)

# Affichage du DataFrame avec les prédictions de quantité pour chaque produit
print(predictions_df)