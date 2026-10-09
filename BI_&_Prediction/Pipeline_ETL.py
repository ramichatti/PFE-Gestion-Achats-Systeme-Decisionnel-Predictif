import pandas as pd
import mysql.connector
import pyodbc

def Extract(bd,source, path, query):
    if source == 'bd':
        if bd == 'MYSQL':
            # Établir la connexion
            conn = mysql.connector.connect(**path)
        elif bd == 'SQL':
            conn = pyodbc.connect(path)
            
        # Utiliser pandas pour lire les résultats de la requête SQL dans un DataFrame
        data = pd.read_sql(query, conn)
        return data
    
    else:
        raise ValueError("Source non prise en charge")

def Load(target, data, output_path, query=None, name_table=None):
    if target == "bd":
        conn = pyodbc.connect(output_path)
        cursor = conn.cursor()

        # Check if the table exists
        cursor.execute(f"SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '{name_table}'")

        if cursor.fetchone()[0] == 0:
            print("La table n'existe pas.")
        else:
            for index, row in data.iterrows():
                # Update or insert into the database
                cursor.execute(query, tuple(row))
            conn.commit()

            print(f"Chargement table avec succès '{name_table}'")

        return data  # Return the DataFrame after the loop

    else:
        raise ValueError("Format de sortie non pris en charge")

# MAIN

# Paramètres de connexion BD

connection_source = {
    'host': 'localhost',
    'user': 'root',
    'database': 'app_gest',
    'password': ''
}

connection_destination = 'DRIVER={SQL Server};SERVER=LAPTOP-NKB7UOMN;DATABASE=DW_APP_ACHAT;UID=sa;PWD=Mo22912604'
################################################################### DIM_UTILISATEUR ###################################################################

# Extraction des données utilisateur

query_utilisateur_data = "SELECT user_id, first_name, last_name, adresse, contact, dept, email, role, bloquer FROM utilisateur"
utilisateur_data = Extract('MYSQL','bd', connection_source, query_utilisateur_data)
print("Avant la transformation :")
print(utilisateur_data)

# Remplacer les valeurs None dans la colonne 'dept' par des chaînes vides
utilisateur_data['dept'] = utilisateur_data['dept'].fillna('')

print("\nAprès la transformation :")
print(utilisateur_data)

# Chargement des données utilisateur 

q1 = '''
MERGE INTO dbo.Dim_Utilisateur AS target
USING (VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)) AS source (user_id, first_name, last_name, adresse, contact, dept, email, role, bloquer)
ON target.Id = source.user_id 
WHEN MATCHED THEN
    UPDATE SET
        target.first_name = source.first_name,
        target.last_name = source.last_name,
        target.adresse = source.adresse,
        target.contact = source.contact,
        target.dept = source.dept,
        target.email = source.email,
        target.role = source.role,
        target.bloquer = source.bloquer
WHEN NOT MATCHED THEN
    INSERT (Id, first_name, last_name, adresse, contact, dept, email, role, bloquer)
    VALUES (source.user_id, source.first_name, source.last_name, source.adresse, source.contact, source.dept, source.email, source.role, source.bloquer);
'''

table1 = "Dim_Utilisateur"
Load('bd', utilisateur_data, connection_destination, query=q1, name_table=table1)



################################################################### DIM_FOURNISSEUR ###################################################################

# Extraction des données fournisseur

query_fournisseur_data = "SELECT F.id_fournisseur, F.nom, F.prenom, F.adresse, F.email, F.cin, F.tel, F.famille_fournisseur, U.bloquer FROM fournisseur F LEFT JOIN utilisateur U ON F.id_fournisseur = U.fournisseur_id"
fournisseur_data = Extract('MYSQL','bd', connection_source, query_fournisseur_data)
print(fournisseur_data)

# Chargement des données utilisateur 

q2 = '''
MERGE INTO dbo.Dim_Fournisseur AS target
USING (VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)) AS source (id_fournisseur, nom, prenom, adresse, email, cin, tel, famille_fournisseur, bloquer)
ON target.Id = source.id_fournisseur
WHEN MATCHED THEN
    UPDATE SET
        target.nom = source.nom,
        target.prenom = source.prenom,
        target.adresse = source.adresse,
        target.email = source.email,
        target.cin = source.cin,
        target.tel = source.tel,
        target.famille_fournisseur = source.famille_fournisseur,
        target.bloquer = source.bloquer
WHEN NOT MATCHED THEN
    INSERT (Id, nom, prenom, adresse, email, cin, tel, famille_fournisseur,bloquer)
    VALUES (source.id_fournisseur, source.nom, source.prenom, source.adresse, source.email, source.cin, source.tel, source.famille_fournisseur, source.bloquer);
'''

table2 = "Dim_Fournisseur"
Load('bd', fournisseur_data, connection_destination, query=q2, name_table=table2)

# ################################################################### DIM_PRODUIT ###################################################################

# Extraction des données produit

query_produit_data = "SELECT produit_id, categorie, description, nom, reference FROM produit"
produit_data = Extract('MYSQL','bd', connection_source, query_produit_data)
print(produit_data)

# Chargement des données produit

q3 = '''
MERGE INTO dbo.Dim_Produit AS target
USING (VALUES (?, ?, ?, ?, ?)) AS source (produit_id, categorie, description, nom, reference)
ON target.Id = source.produit_id
WHEN MATCHED THEN
    UPDATE SET
        target.categorie = source.categorie,
        target.description = source.description,
        target.nom = source.nom,
        target.reference = source.reference
WHEN NOT MATCHED THEN
    INSERT (Id, categorie, description, nom, reference)
    VALUES (source.produit_id, source.categorie, source.description, source.nom, source.reference);
'''

table3 = "Dim_Produit"
Load('bd', produit_data, connection_destination, query=q3, name_table=table3)


#################################################################### FACT_ACHAT ###################################################################

# Extraction des données Demande Achat, Devis, Commande

MysqlQueryFact = '''

SELECT c.commande_id as Document_Id, 'Commande' as Document_Type, lc.ligne_commande_id as Document_Line_id , DATE_FORMAT(c.Commande_date, "%Y-%m-%d") as Date,c.status as status, lc.produit_id as produit_id, c.livraison_date as livraison_date, lc.quantite as quantite, c.prix as Montant_Total , c.fournisseur_id  as fournisseur_id, lc.prix_unitaire as prix_unitaire, lc.remise as remise, lc.ttc as ttc, lc.tva as tva, lc.montant_ht as montant_ht, lc.montant_tva as montant_tva, 0 as user_id, COALESCE(c.avis, 0) AS avis FROM commande c LEFT JOIN ligne_commande lc ON c.commande_id = lc.commande_id 

UNION ALL (SELECT d.devis_id as Document_Id,'Devis' as Document_Type, ld.id as Document_Line_id, DATE_FORMAT(d.devis_date, "%Y-%m-%d") as Date,d.status as status, ld.produit_id as produit_id, d.devis_livraison as livraison_date, ld.quantite as quantite, d.prix as Montant_Total, d.fournisseur_id as fournisseur_id, ld.prix_unitaire as prix_unitaire, ld.remise as remise, ld.ttc as ttc, ld.tva as tva, ld.montantht as montant_ht, ld.montanttva as montant_tva, 0 as user_id, 0 as avis FROM devis d LEFT JOIN demande_devis ld ON d.devis_id = ld.devis_id) UNION ALL 

(SELECT demande_id as Document_Id,'Demande achat' as Document_Type,demande_id as Document_Line_id, DATE_FORMAT(date, "%Y-%m-%d") as Date, statut as status, produit_id as produit_id,'' as livraison_date, qte as quantite,0 as Montant_Total,0 as fournisseur_id,0 as prix_unitaire ,0 as remise ,0 as ttc ,0 as tva ,0 as montant_ht,0 as montant_tva ,user_id as user_id, 0 as avis FROM demande_achat)

'''

Achat_Data = Extract('MYSQL','bd',connection_source,MysqlQueryFact)


SqlQueryDate = "SELECT DateKey, Date FROM [DW_APP_ACHAT].[dbo].[Dim_Date]"
Date_data = Extract('SQL','bd', connection_destination, SqlQueryDate)

merged_data = pd.merge(Achat_Data, Date_data, on='Date', how='left')
# print(merged_data.columns)
# print(merged_data)

# Sélection des colonnes spécifiques dans un nouveau DataFrame
selected_columns = ['Document_Type', 'Document_Id', 'Document_Line_id', 'user_id', 'fournisseur_id',
                    'produit_id', 'avis', 'DateKey', 'quantite',
                    'prix_unitaire', 'tva', 'remise', 'montant_ht', 'ttc',
                    'montant_tva', 'Montant_Total', 'status']


Fact_achat_data = merged_data[selected_columns]


print(Fact_achat_data.columns)
print(Fact_achat_data)

print("Types de données des colonnes dans Fact_achat_data :")
print(Fact_achat_data.dtypes)

q5 = '''
MERGE INTO dbo.Fact_Achat AS target
USING (VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)) AS source (Document_Type, Document_Id, Document_Line_id, user_id, fournisseur_id, produit_id, avis, DateKey, quantite, prix_unitaire, tva, remise, montant_ht, ttc, montant_tva, Montant_Total ,status)
ON 
    target.Document_Type = source.Document_Type
    AND target.Document_Id = source.Document_Id
    AND target.Document_Line_id = source.Document_Line_id
WHEN MATCHED THEN
    UPDATE SET 
        target.utilisateur_fk =  CASE WHEN source.user_id = 0 THEN NULL ELSE source.user_id END,
        target.fournisseur_fk = CASE WHEN source.fournisseur_id = 0 THEN NULL ELSE source.fournisseur_id END,
        target.produit_fk = source.produit_id,
        target.avis = CASE WHEN source.avis = 0 THEN NULL ELSE source.avis END,
        target.date_fk = source.DateKey,
        target.quantite = source.quantite,
        target.prix_unitaire = source.prix_unitaire,     
        target.tva = source.tva,
        target.remise = source.remise,
        target.montant_ht = source.montant_ht,
        target.ttc = source.ttc,
        target.montant_tva = source.montant_tva,
        target.Montant_Total = source.Montant_Total,
        target.status = source.status
WHEN NOT MATCHED THEN
    INSERT (Document_Type, Document_Id, Document_Line_id, utilisateur_fk, fournisseur_fk, produit_fk, avis, date_fk, quantite, prix_unitaire, tva, remise, montant_ht, ttc, montant_tva, Montant_Total, status)
    VALUES (
        source.Document_Type,
        source.Document_Id,
        source.Document_Line_id,
        CASE WHEN source.user_id = 0 THEN NULL ELSE source.user_id END,
        CASE WHEN source.fournisseur_id = 0 THEN NULL ELSE source.fournisseur_id END,
        source.produit_id,
        CASE WHEN source.avis = 0 THEN NULL ELSE source.avis END,
        source.DateKey,
        source.quantite,
        source.prix_unitaire,
        source.tva,
        source.remise,
        source.montant_ht,
        source.ttc,
        source.montant_tva,
        source.Montant_Total,
        source.status
    );
'''

table5 = "Fact_Achat"
Load('bd', Fact_achat_data, connection_destination, query=q5, name_table=table5)
