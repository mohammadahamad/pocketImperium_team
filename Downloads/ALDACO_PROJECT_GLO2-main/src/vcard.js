import fs from "fs/promises";
import path from "path";

/**
 * Fonction pour créer une vCard à partir des informations d'un utilisateur.
 * @param {string} completeName Nom complet de l'utilisateur
 * @param {string} email Adresse e-mail de l'utilisateur
 * @param {string} school École de l'utilisateur
 * @param {string} phone Numéro de téléphone de l'utilisateur
 * @param {*} logger Objet logger pour afficher les messages
 * @returns {Promise<void>}
 */
export async function createVcard(completeName, email, school, phone, logger) {
  // Génération du contenu de la vCard
  try {
    if (!completeName || !email || !school) {
      logger.error(
        "Erreur : nom complet, email et établissement sont obligatoires."
      );
      return;
    }

    // Création du contenu de la vCard
    let vcfContent = `BEGIN:VCARD
VERSION:4.0
FN:${completeName}
EMAIL:${email}
ORG:${school}
`;

    // Ajout du numéro de téléphone si fourni
    if (phone) {
      vcfContent += `TEL:${phone}\n`;
    }

    vcfContent += `END:VCARD\n`;

    // Définition du chemin du fichier vCard
    const vcardName = completeName.split(" ").join("_");
    const filePath = path.join("./res/vcard", `${vcardName}.vcf`);

    await fs.writeFile( filePath, vcfContent, "utf-8");

    logger.info(`Fichier VCard créé avec succès : ${filePath}`);
  } catch (err) {
    logger.error("Erreur lors de la génération de la VCard : " + err.message);
  }
}
