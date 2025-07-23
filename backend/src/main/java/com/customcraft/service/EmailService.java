package com.customcraft.service;

import com.customcraft.model.Order;
import com.customcraft.model.OrderItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    public Mono<Void> sendVerificationEmail(String toEmail, String verificationToken) {
        return Mono.fromRunnable(() -> {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject("Vérification de votre compte CustomCraft");
                message.setText(buildVerificationEmailContent(verificationToken));
                
                mailSender.send(message);
                log.info("Verification email sent to {}", toEmail);
            } catch (Exception e) {
                log.error("Failed to send verification email to {}", toEmail, e);
                throw new RuntimeException("Failed to send verification email", e);
            }
        }).subscribeOn(Schedulers.boundedElastic()).then();
    }
    
    public Mono<Void> sendPasswordResetEmail(String toEmail, String resetToken) {
        return Mono.fromRunnable(() -> {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject("Réinitialisation de votre mot de passe CustomCraft");
                message.setText(buildPasswordResetEmailContent(resetToken));
                
                mailSender.send(message);
                log.info("Password reset email sent to {}", toEmail);
            } catch (Exception e) {
                log.error("Failed to send password reset email to {}", toEmail, e);
                throw new RuntimeException("Failed to send password reset email", e);
            }
        }).subscribeOn(Schedulers.boundedElastic()).then();
    }
    
    public Mono<Void> sendOrderConfirmationEmail(String toEmail, Order order, List<OrderItem> items) {
        return Mono.fromRunnable(() -> {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject("Confirmation de commande " + order.getOrderNumber());
                message.setText(buildOrderConfirmationEmailContent(order, items));
                
                mailSender.send(message);
                log.info("Order confirmation email sent to {} for order {}", toEmail, order.getOrderNumber());
            } catch (Exception e) {
                log.error("Failed to send order confirmation email to {} for order {}", toEmail, order.getOrderNumber(), e);
                throw new RuntimeException("Failed to send order confirmation email", e);
            }
        }).subscribeOn(Schedulers.boundedElastic()).then();
    }
    
    public Mono<Void> sendOrderStatusUpdateEmail(String toEmail, Order order) {
        return Mono.fromRunnable(() -> {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject("Mise à jour de votre commande " + order.getOrderNumber());
                message.setText(buildOrderStatusUpdateEmailContent(order));
                
                mailSender.send(message);
                log.info("Order status update email sent to {} for order {}", toEmail, order.getOrderNumber());
            } catch (Exception e) {
                log.error("Failed to send order status update email to {} for order {}", toEmail, order.getOrderNumber(), e);
                throw new RuntimeException("Failed to send order status update email", e);
            }
        }).subscribeOn(Schedulers.boundedElastic()).then();
    }
    
    private String buildVerificationEmailContent(String verificationToken) {
        return String.format("""
                Bonjour,
                
                Merci de vous être inscrit sur CustomCraft !
                
                Pour vérifier votre compte, veuillez cliquer sur le lien suivant :
                http://localhost:3000/verify-email?token=%s
                
                Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.
                
                Cordialement,
                L'équipe CustomCraft
                """, verificationToken);
    }
    
    private String buildPasswordResetEmailContent(String resetToken) {
        return String.format("""
                Bonjour,
                
                Vous avez demandé la réinitialisation de votre mot de passe CustomCraft.
                
                Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant :
                http://localhost:3000/reset-password?token=%s
                
                Ce lien expirera dans 1 heure.
                
                Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
                
                Cordialement,
                L'équipe CustomCraft
                """, resetToken);
    }
    
    private String buildOrderConfirmationEmailContent(Order order, List<OrderItem> items) {
        StringBuilder content = new StringBuilder();
        content.append(String.format("""
                Bonjour %s,
                
                Merci pour votre commande ! Voici les détails :
                
                Numéro de commande : %s
                Date de commande : %s
                Statut : %s
                
                Articles commandés :
                """, order.getShippingName(), order.getOrderNumber(), 
                order.getCreatedAt().toLocalDate(), order.getStatus()));
        
        for (OrderItem item : items) {
            content.append(String.format("- %s x%d - €%.2f\n", 
                    item.getProductName(), item.getQuantity(), item.getTotalPrice()));
        }
        
        content.append(String.format("""
                
                Sous-total : €%.2f
                Livraison : €%.2f
                Total : €%.2f
                
                Adresse de livraison :
                %s
                %s, %s %s
                %s
                
                Livraison estimée : %s
                
                Vous recevrez un email de confirmation dès que votre commande sera expédiée.
                
                Cordialement,
                L'équipe CustomCraft
                """, order.getSubtotalAmount(), order.getShippingAmount(), order.getTotalAmount(),
                order.getShippingAddress(), order.getShippingCity(), 
                order.getShippingPostalCode(), order.getShippingCountry(),
                order.getEstimatedDeliveryDate().toLocalDate()));
        
        return content.toString();
    }
    
    private String buildOrderStatusUpdateEmailContent(Order order) {
        String statusMessage = switch (order.getStatus()) {
            case CONFIRMED -> "Votre commande a été confirmée et est en cours de préparation.";
            case PROCESSING -> "Votre commande est en cours de traitement.";
            case SHIPPED -> String.format("Votre commande a été expédiée ! Numéro de suivi : %s", 
                    order.getTrackingNumber());
            case DELIVERED -> "Votre commande a été livrée avec succès !";
            case CANCELLED -> "Votre commande a été annulée.";
            default -> "Le statut de votre commande a été mis à jour.";
        };
        
        return String.format("""
                Bonjour %s,
                
                Mise à jour concernant votre commande %s :
                
                %s
                
                Vous pouvez suivre votre commande en vous connectant à votre compte sur notre site.
                
                Cordialement,
                L'équipe CustomCraft
                """, order.getShippingName(), order.getOrderNumber(), statusMessage);
    }
}