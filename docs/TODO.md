# TODO - Aktueller Stand (bereits implementiert)

✅ `/help`  
✅ `/rules` => Modify permissions with roleid
✅ `/announcement` => Modify permissions with roleid  
✅ `/changelog`

---

# TODO - Nächste Schritte

## 1. Modularisierung & Core
- [ ] Modularen Aufbau (Module als einzelne Klassen/Ordner) implementieren
- [ ] Core-Bot mit Command-Handler & Event-Handler fertigstellen (Saubere Trennung)

## 2. WelcomeModule
- [ ] Willkommensnachricht (Channel + DM)
- [ ] Automatische Rollenzuweisung "Mitglied"

## 3. RolesModule
- [ ] Selbstzuweisbare Rollen (Slash-Command / Reactions)
- [ ] Automatische Rollenzuweisung bei Join (weiter automatisieren)

## 4. ModerationModule
- [ ] `/ban`, `/kick`, `/warn`, `/timeout` Commands implementieren
- [ ] Anti-Spam + Anti-Link Filter (Trigger + Logs)
- [ ] Moderations-Logs (Join/Leave/Delete/Warnungen)

## 5. LevelingModule
- [ ] XP-System (Chat-Nachrichten tracken)
- [ ] `/top10` Leaderboard
- [ ] Rollen bei Level-Up freischalten

## 6. AutoResponseModule
- [ ] Keyword-Trigger & FAQ Links
- [ ] `/faq` Command

## 7. SupportModule
- [ ] Ticket-System (`/ticket`) mit Erstellung, Schließung, Log
- [ ] Support-Commands optimieren

## 8. AnnouncementModule (erweitern)
- [ ] Twitch-Stream Benachrichtigungen automatisieren
- [ ] Ping-System für Zielgruppen

## 9. FunModule
- [ ] `/dice`, `/8ball`, `/meme`, `/gif` Commands

## 10. AdminModule
- [ ] Admin-Tools `/stats`, `/report`, `/suggest`, `/bug`
- [ ] Backup & Log Export

## 11. Infrastruktur & Tests
- [ ] Deployment (Docker, Heroku, VPS)
- [ ] Monitoring & Logging
- [ ] Tests & Dokumentation

---
