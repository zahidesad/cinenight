package com.zahid.cinenight.features.notifications.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mail;
    private final String from;

    public EmailService(JavaMailSender mail,
                        @Value("${app.mail.from}") String from) {
        this.mail = mail;
        this.from = from;
    }

    public void sendPasswordReset(String to, String resetLink) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject("Şifre sıfırlama bağlantın");
        msg.setText("""
                Merhaba,

                Şifreni sıfırlamak için aşağıdaki bağlantıya 1 saat içinde tıkla:
                %s

                Eğer bu talebi sen yapmadıysan bu e-postayı yok sayabilirsin.
                """.formatted(resetLink));
        mail.send(msg);
    }
}
