const Ticket = require("../models/ticket");
const {PRIORITY, STATUS, USER_ROLES, USER_STATUS} = require("../models/enums");
const User = require("../models/user");
const {Sequelize} = require("sequelize");
const getAllTickets = async (req, res) => {
    try {
        const {page = 1, size = 10, status, priority} = req.query;
        const startIndex = (page - 1) * size;
        const endIndex = page * size;
        const userId = req.user.id;
        let whereClause = {};
        whereClause = {
            [Sequelize.Op.or]: [
                {status: STATUS.OPENED},
                {
                    status: {
                        [Sequelize.Op.in]: [STATUS.CLOSED, STATUS.IN_PROGRESS]
                    },
                    support_id: userId
                }
            ]
        }
        let tickets = await Ticket.findAll({
            where: whereClause,
            order: [['status', 'ASC']],
        });


        if (status !== '') {
            tickets = tickets.filter(e => e.dataValues.status == status);
        }

        if (priority !== '') {
            tickets = tickets.filter(e => e.dataValues.priority == priority);
        }

        const respTickets = tickets.slice(startIndex, endIndex);

        const mappedTickets = respTickets.map(ticket => ({
            ...ticket.dataValues,
            priority: Object.keys(PRIORITY).find(key => PRIORITY[key] === ticket.dataValues.priority),
            status: Object.keys(STATUS).find(key => STATUS[key] === ticket.dataValues.status),
        }));

        res.status(200).send({tickets: mappedTickets, total: tickets.length});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};


const getTicketPriority = async (req, res) => {
    try {
        const ticketPriorityArray = Object.keys(PRIORITY)
            .map(key => ({key: PRIORITY[key], value: key}))

        res.json(ticketPriorityArray);
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const getTicketStatus = async (req, res) => {
    try {
        const ticketStatusArray = Object.keys(STATUS)
            .map(key => ({key: STATUS[key], value: key}))

        res.json(ticketStatusArray);
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const getTicketsByAdminId = async (req, res) => {
    try {
        let id = req.params.id;
        let tickets;
        switch (req.query.replied) {
            case 2: //procitano tj odgovoreno tj closed
                tickets = await Ticket.findAll({where: {support_id: id, status: 1}})
                break;
            case 1://in porogress stavio na sebe nije odgovorio
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
const getTicketById = async (req, res) => {
    try {
        let id = req.params.id
        let ticket = await Ticket.findOne({
            where: {id: id},
            include: [
                {
                    model: User,
                    as: 'createdTicket',
                },
                {
                    model: User,
                    as: 'assignedToTicket',
                }
            ],
            attributes: {exclude: ['client_id', 'support_id']},
        });
        const mappedTicket = {
            ...ticket.dataValues,
            priority: Object.keys(PRIORITY).find(key => PRIORITY[key] === ticket.dataValues.priority),
            status: Object.keys(STATUS).find(key => STATUS[key] === ticket.dataValues.status),
        };
        res.status(200).send(mappedTicket)

    } catch (error) {
        console.log("greska ", error)
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
                tickets = await Ticket.findAll({where: {client_id: id, status: 0}})
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
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const assignToTicket = async (req, res) => {
    try {
        let {ticketId} = req.params
        const numericTicketId = parseInt(ticketId);
        const existingTicket = await Ticket.findOne({
            where: {
                id: numericTicketId,
            }
        });
        if (existingTicket) {
            existingTicket.support_id = req.user.id;
            existingTicket.status = 1;//in progress
            await existingTicket.save();
            const resp = Object.keys(STATUS).find(key => STATUS[key] === existingTicket.dataValues.status);

            res.status(200).json({
                success: true,
                message: 'Ticket successfully assigned to support.',
                status: resp
            })
        } else {

            res.status(404).json({success: false, message: 'Ticket not found.'});
        }

    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const replyToTicket = async (req, res) => {
    try {
        let {ticketId} = req.params
        const answer = req.body.answer;
        const numericTicketId = parseInt(ticketId);
        const existingTicket = await Ticket.findOne({
            where: {
                id: numericTicketId,
            }
        });

        if (existingTicket) {
            existingTicket.support_id = req.user.id;
            existingTicket.answer = answer;
            existingTicket.status = 2;//closed
            await existingTicket.save();
            res.status(200).json({success: true, message: 'Ticket successfully assigned to support and replied.'})
        } else {
            res.status(404).json({success: false, message: 'Ticket not found.'});
        }

    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}

module.exports = {
    createTicket,
    getAllTickets,
    getTicketsByAdminId,
    getTicketsByUserId,
    assignToTicket,
    replyToTicket,
    getTicketStatus,
    getTicketPriority,
    getTicketById

}