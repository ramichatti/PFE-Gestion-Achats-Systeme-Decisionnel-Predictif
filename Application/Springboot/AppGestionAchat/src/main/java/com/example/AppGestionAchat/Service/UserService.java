package com.example.AppGestionAchat.Service;

import com.example.AppGestionAchat.Entity.Fournisseur;
import com.example.AppGestionAchat.Entity.User;
import com.example.AppGestionAchat.Repository.UserRepository;
import com.example.AppGestionAchat.Security.PasswordUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.mindrot.jbcrypt.BCrypt;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public String getUserRole(String username) {
        User user = userRepository.findByEmail(username);
        if (user != null) {
            return user.getRole();
        } else {
            return null; // Handle non-existing user
        }
    }



    @Transactional
    public void deleteUser(Integer userId) {
        userRepository.deleteById(userId);
    }

    public List<User> findByFirstName(String firstName) {
        return userRepository.findByFirstName(firstName);
    }

    public Optional<User> updateUserStatus(Integer userId) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            // Update the 'bloquer' field based on its current value
            existingUser.setBloquer(!existingUser.isBloquer());

            // Save the updated user to the repository
            return Optional.of(userRepository.save(existingUser));
        } else {
            // User with the given ID not found
            return Optional.empty();
        }
    }

    public Optional<User> updateUser(User user) {
        return userRepository.findById(user.getUserId())
                .map(existingUser -> {
                    existingUser.setFirst_name(user.getFirst_name());
                    existingUser.setLast_name(user.getLast_name());

                    // Chiffrer le nouveau mot de passe avant de le mettre à jour
                    String encryptedPassword = PasswordUtils.encryptPassword(user.getPassword());
                    existingUser.setPassword(encryptedPassword);

                    existingUser.setEmail(user.getEmail());
                    existingUser.setContact(user.getContact());
                    existingUser.setRole(user.getRole());
                    existingUser.setAdresse(user.getAdresse());
                    existingUser.setDept(user.getDept());
                    existingUser.setBloquer(user.isBloquer());
                    // Si le rôle de l'utilisateur est "FOURNISSEUR", mettre à jour le fournisseur associé
                    if ("FOURNISSEUR".equals(user.getRole())) {
                        // Vérifier si le fournisseur associé existe
                        Fournisseur fournisseur = user.getFournisseur();
                        if (fournisseur != null) {
                            existingUser.setFournisseur(fournisseur);
                        } else {
                            // S'il n'y a pas de fournisseur associé, définir le fournisseur sur null
                            existingUser.setFournisseur(null);
                        }
                    } else if ("DIRECTEUR_ACHAT".equals(user.getRole()) ||
                            "USER".equals(user.getRole()) ||
                            "RESPONSABLE_ACHAT".equals(user.getRole())) {
                        // Si le rôle de l'utilisateur est changé en "DIRECTEUR_ACHAT", "USER" ou "RESPONSABLE_ACHAT", mettre le fournisseur_id à null
                        existingUser.setFournisseur(null);
                    }

                    return userRepository.save(existingUser);
                });
    }

    public Optional<User> updateUserContactAndAdresse(Integer userId, Integer newContact, String newAdresse) {
        return userRepository.findById(userId)
                .map(existingUser -> {
                    existingUser.setContact(newContact);
                    existingUser.setAdresse(newAdresse);
                    return userRepository.save(existingUser);
                });
    }

    public Optional<User> updateUserImage(Integer userId, byte[] newImage) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setImage(newImage);
            return Optional.of(userRepository.save(user));
        } else {
            return Optional.empty();
        }
    }

    public Resource getUserImage(Integer userId) throws IOException {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            byte[] imageData = user.getImage();
            if (imageData != null && imageData.length > 0) {
                return new ByteArrayResource(imageData);
            }
        }
        return null;
    }
    public byte[] getUserImageByFournisseurId(Integer fournisseurId) {
        return userRepository.getUserImageByFournisseurId(fournisseurId);
    }

}

