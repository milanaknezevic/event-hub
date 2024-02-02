const Ticket = require("../models/ticket");
const getAllTickets = async (req, res) => {
    try {
        let tickets = await Ticket.findAll({});
        res.status(200).send({tickets});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const getTicketsByAdminId = async (req, res) => {
    try {
        let id = req.params.id;
        let repliedOptions = req.query.replied === 'true';
        let tickets;
        switch (repliedOptions) {
            case true: //procitano
                tickets = await Ticket.findAll({where: {support_id: id, status: 1}})
                break;
            case false://nije procitano
                tickets = await Ticket.findAll({where: {support_id: id, status: 2}})
                break;
            default: //i procitano i ne procitano
                tickets = await Ticket.findAll({where: {support_id: id}})
                break;
        }

        res.status(200).send({tickets});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}

const createTicket = async (req, res) => {
    try {
        const ticketData = {
            question: req.body.question,
            priority: req.body.priority,
            status: req.body.status,//treba biti 0 po defaultu jer je opened cim je kreiran
            client_id: req.body.client_id,
            creationDate: new Date(),
        };

        const newTicket = await Ticket.create(ticketData);
        res.status(201).json({
            message: 'Ticket created successfully',
            ticket: newTicket,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const assignToTicket = async (req, res) => {
    try {
        let {ticketId, supportId} = req.params
        const existingTicket = await Ticket.findOne({
            where: {
                id: ticketId,
            }
        });
        if (existingTicket) {
            existingTicket.support_id = supportId;
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
        let {ticketId, supportId} = req.params
        const answer = req.body.answer;
        console.log(answer)
        const existingTicket = await Ticket.findOne({
            where: {
                id: ticketId,
            }
        });
        if (existingTicket) {
            existingTicket.support_id = supportId;
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
    getAllTickets,
    createTicket,
    getTicketsByAdminId,
    assignToTicket,
    replyToTicket

}