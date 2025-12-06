import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();

class MailServices {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        })
        console.log(this.transporter.sendMail)
    }
    async sendActivationLink(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `Activation Link: ${link}`,
            text: `Activation Link: ${link}`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <h1>Aktivatsiya qilish uchun ushbu linkga tashrif buyuring</h1>
                <a href="${link}">${link}</a>
</html>
                `
        })
    }
}

export default new MailServices();