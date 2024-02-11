const Ticket = require("../models/ticket");
const { PRIORITY, STATUS} = require("../models/enums");
const getAllTickets = async (req, res) => {
    try {
        let tickets = await Ticket.findAll({
            where: {
                status: 0,
            }
        });
        const mappedTickets = tickets.map(ticket => ({
            ...ticket.dataValues,
            priority: Object.keys(PRIORITY).find(key => PRIORITY[key] === ticket.dataValues.priority),
            status: Object.keys(STATUS).find(key => STATUS[key] === ticket.dataValues.status),
        }));
        res.status(200).send({mappedTickets});
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const getTicketsByAdminId = async (req, res) => {
    try {
        let id = req.params.id;
        let tickets;
        switch (req.query.replied) {
            case 1: //procitano tj odgovoreno tj closed
                tickets = await Ticket.findAll({where: {support_id: id, status: 1}})
                break;
            case 2://in porogress stavio na sebe nije odgovorio
                tickets = await Ticket.findAll({where: {support_id: id, status: 2}})
                break;
            default:
                break;
        }
        const mappedTickets = tickets.map(ticket => ({
            ...ticket.dataValues,
            priority: Object.keys(PRIORITY).find(key => PRIORITY[key] === newTicket.dataValues.priority),
            status: Object.keys(STATUS).find(key => STATUS[key] === newTicket.dataValues.status),
        }));
        res.status(200).send({mappedTickets});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const getTicketsByUserId = async (req, res) => {
    try {
        let id = req.params.id;
        let tickets;
        switch (req.query.replied) {
            case 1: //procitano
                tickets = await Ticket.findAll({where: {client_id: id, status: 1}})
                break;
            case 2://nije procitano tj in progress
                tickets = await Ticket.findAll({where: {client_id: id, status: 2}})
                break;
            default: //open tiketi
                tickets = await Ticket.findAll({where: {client_id: id, status:0}})
                break;
        }

        const mappedTickets = tickets.map(ticket => ({
            ...ticket.dataValues,
            priority: Object.keys(PRIORITY).find(key => PRIORITY[key] === newTicket.dataValues.priority),
            status: Object.keys(STATUS).find(key => STATUS[key] === newTicket.dataValues.status),
        }));
        res.status(200).send({mappedTickets});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}

const createTicket = async (req, res) => {
    try {
        const ticketData = {
            question: req.body.question,
            client_id: req.body.client_id,
            creationDate: new Date(),
        };

        const newTicket = await Ticket.create(ticketData);
        const mappedTicket = {
            ...newTicket.dataValues,
            priority: Object.keys(PRIORITY).find(key => PRIORITY[key] === newTicket.dataValues.priority),
            status: Object.keys(STATUS).find(key => STATUS[key] === newTicket.dataValues.status),
        };
        res.status(201).json({
            message: 'Ticket created successfully',
            ticket: mappedTicket,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const assignToTicket = async (req, res) => {
    try {
        let ticketId = req.params
        const existingTicket = await Ticket.findOne({
            where: {
                id: ticketId,
            }
        });
        if (existingTicket) {
            existingTicket.support_id = req.user.id;
            existingTicket.status = 2;//in progress
            await existingTicket.save();
            res.status(200).json({success: true, message: 'Ticket successfully assigned to support.'})
        } else {
            res.status(404).json({success: false, message: 'Ticket not found.'});
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const replyToTicket = async (req, res) => {
    try {
        let ticketId = req.params
        const answer = req.body.answer;
        console.log(answer)
        const existingTicket = await Ticket.findOne({
            where: {
                id: ticketId,
            }
        });
        if (existingTicket) {
            existingTicket.support_id = req.user.id;
            existingTicket.answer = answer;
            existingTicket.status = 1;//closed
            await existingTicket.save();
            res.status(200).json({success: true, message: 'Ticket successfully assigned to support and replied.'})
        } else {
            res.status(404).json({success: false, message: 'Ticket not found.'});
        }

    } catch (error) {
       // console.log(error)
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}

module.exports = {
    createTicket,
    getAllTickets,
    getTicketsByAdminId,
    getTicketsByUserId,
    assignToTicket,
    replyToTicket

}