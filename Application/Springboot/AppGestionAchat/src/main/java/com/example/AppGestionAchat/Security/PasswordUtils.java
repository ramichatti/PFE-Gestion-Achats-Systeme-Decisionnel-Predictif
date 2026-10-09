package com.example.AppGestionAchat.Security;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class PasswordUtils {

    private static final String SECRET_KEY = "ashjasasashjasas";  // Clé secrète pour le chiffrement AES

    // Fonction pour chiffrer un mot de passe avec AES
    public static String encryptPassword(String password) {
        try {
            SecretKey secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encryptedBytes = cipher.doFinal(password.getBytes());
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return null; // Gestion de l'erreur
        }
    }

    // Fonction pour déchiffrer un mot de passe avec AES
    public static String decryptPassword(String encryptedPassword) {
        try {
            SecretKey secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedPassword));
            return new String(decryptedBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return null; // Gestion de l'erreur
        }
    }

    // Fonction pour vérifier si un mot de passe correspond au hachage stocké
    public static boolean checkPassword(String inputPassword, String storedPassword) {
        String decryptedStoredPassword = decryptPassword(storedPassword);
        return inputPassword.equals(decryptedStoredPassword);
    }
}
