package com.example.AppGestionAchat.Controller;

import com.example.AppGestionAchat.Entity.Fournisseur;
import com.example.AppGestionAchat.Entity.User;
import com.example.AppGestionAchat.Repository.FournisseurRepository;
import com.example.AppGestionAchat.Repository.UserRepository;
import com.example.AppGestionAchat.Security.PasswordUtils;
import com.example.AppGestionAchat.Service.UserService;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FournisseurRepository fournisseurRepository;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {
        User user = userService.findByEmail(request.getEmail());
        if (user != null && PasswordUtils.checkPassword(request.getPassword(), user.getPassword())) {
            if (user.isBloquer()) {
                // Si l'utilisateur est bloqué, renvoyer une réponse indiquant qu'il est bloqué
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Votre compte est bloqué. Veuillez contacter l'administrateur.");
            }

            String role = userService.getUserRole(request.getEmail());
            if (role != null) {
                // Créez ici un objet de réponse contenant les détails de l'utilisateur
                Map<String, Object> response = new HashMap<>();
                response.put("id", user.getUserId());
                response.put("first_name", user.getFirst_name());
                response.put("last_name", user.getLast_name());
                response.put("role", role);
                response.put("email", user.getEmail());
                response.put("adresse", user.getAdresse());
                response.put("contact", user.getContact());
                response.put("dept", user.getDept());
                response.put("bloquer", user.isBloquer());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve user role");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @GetMapping("/getAllUsers")
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        // Déchiffrer les mots de passe de chaque utilisateur
        users.forEach(user -> {
            String decryptedPassword = PasswordUtils.decryptPassword(user.getPassword());
            user.setPassword(decryptedPassword);
        });
        return users;
    }

    @PostMapping("/addUser")
    public User addUser(@RequestBody User user) {
        // Vérifie si l'utilisateur est associé à un fournisseur
        Fournisseur user_fournisseur = user.getFournisseur();
        if (!user.getRole().equals("FOURNISSEUR")) {
            user.setFournisseur(null);
        }
        else {
            user.setFournisseur(user_fournisseur);
        }

        // Crypte le mot de passe
        String encryptedPassword = PasswordUtils.encryptPassword(user.getPassword());
        user.setPassword(encryptedPassword);

        // Charge l'image par défaut à partir des ressources
        try {
            Resource resource = new ClassPathResource("/images/defaultImage.jpg");
            InputStream inputStream = resource.getInputStream();
            byte[] defaultImageBytes = IOUtils.toByteArray(inputStream);
            user.setImage(defaultImageBytes);
        } catch (IOException e) {
            // Gérer l'exception (par exemple, logguer l'erreur)
            e.printStackTrace();
        }

        // Enregistre l'utilisateur
        return userRepository.save(user);
    }

    @DeleteMapping("/deleteUser/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok().body("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete user");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsersByFirstName(@RequestParam("firstName") String firstName) {
        List<User> users = userRepository.findByFirstName(firstName);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/updateUser")
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        userService.updateUser(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/updateProfile/{userId}")
    public ResponseEntity<User> updateProfile(@PathVariable Integer userId, @RequestBody User user) {
        Optional<User> updatedUser = userService.updateUserContactAndAdresse(userId, user.getContact(), user.getAdresse());
        if (updatedUser.isPresent()) {
            return ResponseEntity.ok(updatedUser.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{userId}/updateImage")
    public ResponseEntity<User> updateUserImage(@PathVariable Integer userId, @RequestParam("file") MultipartFile file) {
        try {
            Optional<User> updatedUser = userService.updateUserImage(userId, file.getBytes());
            return updatedUser.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/status/{userId}")
    public ResponseEntity<?> updateUserStatus(@PathVariable Integer userId) {
        Optional<User> optionalUser = userService.updateUserStatus(userId);

        if (optionalUser.isPresent()) {
            User updatedUser = optionalUser.get();
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with ID " + userId + " not found");
        }
    }

    @GetMapping("/{userId}/image")
    public ResponseEntity<Resource> getUserImage(@PathVariable Integer userId) {
        try {
            Resource imageResource = userService.getUserImage(userId);
            if (imageResource != null) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + "user_image.jpg" + "\"")
                        .body(imageResource);
            } else {
                // Si l'image n'est pas trouvée, retourner une réponse 404 Not Found.
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            // Gérer les erreurs IO, par exemple, logguer l'erreur.
            e.printStackTrace();
            // Retourner une réponse d'erreur 500 Internal Server Error.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/image/{fournisseurId}")
    public ResponseEntity<byte[]> getUserImageByFournisseurId(@PathVariable Integer fournisseurId) {
        byte[] userImage = userService.getUserImageByFournisseurId(fournisseurId);
        if (userImage != null) {
            // Si une image est trouvée, la retourner avec le code de statut 200 OK
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(userImage);
        } else {
            // Si aucune image n'est trouvée, retourner une réponse avec le code de statut 404 Not Found
            return ResponseEntity.notFound().build();
        }
    }

}
