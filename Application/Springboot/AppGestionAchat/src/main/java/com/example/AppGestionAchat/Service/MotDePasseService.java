package com.example.AppGestionAchat.Service;

import com.example.AppGestionAchat.Entity.User;
import com.example.AppGestionAchat.Repository.UserRepository;
import com.example.AppGestionAchat.Security.PasswordUtils;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service

public class MotDePasseService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender javaMailSender;

    public boolean reinitialiserMotDePasse(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            String password = generateRandomPassword();

            String encryptedPassword = PasswordUtils.encryptPassword(password);
            user.setPassword(encryptedPassword);
            userRepository.save(user);

            sendPasswordByEmail(user.getEmail(), password);
            return true; // La réinitialisation du mot de passe a réussi
        } else {
            return false; // L'utilisateur avec cet e-mail n'existe pas
        }
    }

    private void sendPasswordByEmail(String email, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Réinitialisation de mot de passe");
        message.setText("Votre nouveau mot de passe est : " + password);
        javaMailSender.send(message);
    }

    private String generateRandomPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}