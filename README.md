# ltims

Een LTI Tool voor integratie met Learning Management Systems (LMS). Deze README beschrijft hoe je het project lokaal kunt opzetten, registreren en gebruiken in een LMS.

---

## Vereisten

- Node.js v23.4.0
- NPM dependencies:
  - `"axios": "^1.7.9"`
  - `"cors": "^2.8.5"`
  - `"dotenv": "^16.4.7"`
  - `"express": "^4.21.2"`
  - `"ltijs": "^5.9.6"`
  - `"mongodb": "^6.12.0"`

---

## Lokale Setup

1. **Ngrok installeren**
   - Maak een account aan op [ngrok.com](https://ngrok.com).
   - Download en installeer ngrok op je lokale machine.
   - Maak een domein aan via [het dashboard](https://dashboard.ngrok.com/domains).

2. **MongoDB Cloud instellen**
   - Maak een account aan op [mongodb.com](https://mongodb.com).
   - Maak een Cluster aan in MongoDB Cloud.
   - Voeg bij **Network Access** het IP-adres `0.0.0.0/0` toe voor testdoeleinden.

3. **Environment Variabelen**
   - Maak een `.env` bestand aan in de root van je project. Gebruik het voorbeeld hieronder:
     
     ```
     LTI_KEY=edufaceltims0707
     
     PORT=3000
     
     FRONTEND_URL=http://localhost:3001
     
     MONGO_URL=mongodb+srv://cluster0.hsggf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     MONGO_USER=jesse
     MONGO_PASSWORD=mKeWPZI6VR
     
     TOOL_URL=https://dog-driving-loudly.ngrok-free.app
     TOOL_NAME=Eduface LTI Tool Jesse 4
     TOOL_DESCRIPTION=Eduface LTI Tool voor integratie LMS
     ```

4. **Dependencies installeren**
   - Open een terminal en voer de volgende commando's uit:
     
     ```
     npm install
     npm run dev
     ```

5. **Ngrok configureren**
   - Open een extra terminal en voer het volgende uit:
     
     ```
     ngrok http --url=dog-driving-loudly.ngrok-free.app 3000
     ```
   - Vervang `dog-driving-loudly.ngrok-free.app` met jouw eigen Ngrok-domein.

---

## Tool registreren en gebruiken in een LMS

1. **LTI Tool registreren**
   - Ga naar **Manage Extensibility -> LTI Advantage -> Register Tool**.
   - Kies voor de optie "Dynamic" en voer een URL in met het formaat: `TOOL_URL/register`. Bijvoorbeeld:
     
     ```
     https://dog-driving-loudly.ngrok-free.app/register
     ```

2. **Tool inschakelen**
   - Ga naar **Manage Extensibility -> LTI Advantage -> Tool** en zet deze op "Enabled". *(TODO: Automatisch instellen)*

3. **Security-instellingen**
   - Open de Tool en vink **"Send Institution Role"** aan. *(TODO: Automatisch instellen)*

4. **Deployment aanmaken**
   - Ga naar **View Deployments -> New Deployment**.
   - Selecteer de geregistreerde tool en gebruik de volgende instellingen:
     - **Name**: TOOL_NAME + "| Deployment". Bijvoorbeeld: `Eduface LTI Tool | Deployment`.
     - **Description**: TOOL_DESCRIPTION.
     - **Security Settings**: Vink alles aan behalve "Anonymous" en "Classlist including users not known to this deployment".
     - **Make tool available to**: Selecteer jouw Organization en kies "This org unit and all descendants".
   - Maak de Deployment aan.

5. **Link aanmaken**
   - Klik in de popup op **View Links** en maak een nieuwe link aan:
     - **Name**: `Eduface AI Feedback`.
     - **URL**: `TOOL_URL/launch`.

6. **Tool toevoegen aan een cursus**
   - Ga naar **Course -> Module -> Existing Activities -> External Learning Tools** en selecteer de zojuist aangemaakte link.

7. **Token bekijken**
   - Zodra de tool is toegevoegd, zie je het token dat naar LTIMS wordt gestuurd.

---

## Licentie

Dit project is gelicenseerd onder de MIT-licentie. Zie het LICENSE-bestand voor meer informatie.
