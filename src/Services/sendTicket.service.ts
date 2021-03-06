import { Request } from "express";
import { Event, Reservation } from "../Types";

const mailer: any = require('../Config/mailer.config');
const Twig = require('node-twig');
const pdf = require('html-pdf');
const options = { 
    format: 'Tabloid',
    directory: __dirname.split('/src')[0],
    orientation: 'landscape',
    timeout: 540000 
};

const message = async (req: Request, event: Event, reservation: Reservation) => {
    Twig.renderFile(
        __dirname.split('src/')[0] + "public/Pages/ticket.html", 
        { 
            context: {
                title: "test",
                event_title: event.title,
                day: event.dateEvent.split(' ')[0],
                date: `${event.dateEvent.split(' ')[1]} ${event.dateEvent.split(' ')[2]}`,
                year: `${event.dateEvent.split(' ')[3]}`,
                category: event.category,
                reservation_code: reservation.codeReservation
            }
        }, 
        (err: any, html: string) => {
            const pdfPath = `${__dirname.split('/src')[0]}/public/tickets/${reservation.reservationDate.toString()}.pdf`;

            pdf.create(html, options).toFile(pdfPath, () => {
                mailer.sendMail({
                    to: (req as any).clientEmail,
                    from: 'noreply@gmail.com',
                    subject: "Ticket ordering",
                    html: html,
                    attachments: [
                        {
                            filename: `Ticket_${reservation.placeNumber}_${reservation.reservationDate.toString()}.pdf`,
                            path: pdfPath,
                            contentType: 'application/pdf'
                        }
                    ]
                });
            });
    })
}

module.exports = message;