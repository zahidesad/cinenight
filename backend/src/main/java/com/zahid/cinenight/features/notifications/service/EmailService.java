package com.zahid.cinenight.features.notifications.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mail;
    private final String from;
    private final MessageSource messageSource;

    public EmailService(JavaMailSender mail,
                        @Value("${app.mail.from}") String from,
                        MessageSource messageSource) {
        this.mail = mail;
        this.from = from;
        this.messageSource = messageSource;
    }

    private String getMsg(String key, Object... args) {
        return messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
    }

    public void sendPasswordReset(String to, String resetLink) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject(getMsg("email.subject.reset"));
        msg.setText(getMsg("email.body.reset", resetLink));
        mail.send(msg);
    }

    public void sendVerification(String to, String link) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject(getMsg("email.subject.verify"));
        msg.setText(getMsg("email.body.verify", link));
        mail.send(msg);
    }

    public void sendEmailChangeVerification(String to, String link) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject(getMsg("email.subject.change"));
        msg.setText(getMsg("email.body.change", link));
        mail.send(msg);
    }
}