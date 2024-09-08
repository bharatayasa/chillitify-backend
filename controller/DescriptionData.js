const connection = require('../config/db');
const moment = require('moment'); 

module.exports = {
    getAllDataDescription: async(req, res) => {
        const sql = `SELECT id, class, description, prevention, created_at, updated_at, deleted_at FROM description`

        try {
            const descriptions = await new Promise((resolve, reject) => {
                connection.query(sql, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                })
            })

            const formatDescription = descriptions.map(description => ({
                id: description.id,
                calss: description.class,
                description: description.description,
                prevention: description.prevention,
                created_at: moment(description.created_at).format('DD-MM-YYYY'),
                updated_at: moment(description.updated_at).format('DD-MM-YYYY'),
                deleted_at: moment(description.deleted_at).format('DD-MM-YYYY'),
            }))

            return res.status(200).json({
                message: "sucess to get data", 
                data: formatDescription
            })
        } catch (error) {
            return res.status(500).json({
                message: "internal server error", 
                error: error.message
            })
        }
    },
    getDataDescriptionById: async(req, res) => {
        const sql = "SELECT * FROM description WHERE id = ?"
        const id = req.params.id

        try {
            const description = await new Promise((resolve, reject) => {
                connection.query(sql, id, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                })
            })

            return res.status(200).json({
                message: "sucess to get data by id", 
                data: description
            })
        } catch (error) {
            return res.status(500).json({
                message: "internal server error", 
                error: error.message
            })
        }
    },
    addDataDescription: async(req, res) => {
        const {	clas , description, prevention } =  req.body
        const sql = "INSERT INTO description (class, description, prevention) VALUE (?, ?, ?)"

        try {
            const data = await new Promise((resolve, reject) => {
                connection.query(sql, [clas, description, prevention], (error, result) => {
                    if (error) {
                        reject(error)
                    }
                    resolve(result)
                })
            })

            return res.status(201).json({
                message: "sucess to add description data", 
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                message: "internal server error", 
                error: error.message
            })
        }
    }, 
    updateDescriptionData: async(req, res) => {
        const id = req.params.id; 
        const {	clas , description, prevention } =  req.body;
        const sql = "UPDATE description SET class = ?, description = ? , prevention = ? WHERE id = ?"; 

        try {
            const data = await new Promise((resolve, reject) => {
                connection.query(sql, [clas , description, prevention, id], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result); 
                })
            })

            return res.status(201).json({
                message: "success to update data", 
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                message: "internal server error", 
                error: error.message
            })
        }
    }, 
    deleteDescriptionData: async (req, res) => {
        const id = req.params.id; 
        const sql = "UPDATE description SET deleted_at = NOW() WHERE id = ?"

        try {
            const data = await new Promise((resolve, reject) => {
                connection.query(sql, id, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result); 
                })
            })

            return res.status(201).json({
                message: "success delete description data", 
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                message: "internal server error", 
                error: error.message
            })
        }
    },
    restoreDescriptionData: async (req, res) => {
        const id = req.params.id; 
        const sql = "UPDATE description SET deleted_at = NULL WHERE id = ?"

        try {
            const data = await new Promise((resolve, reject) => {
                connection.query(sql, id, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result); 
                })
            })

            return res.status(201).json({
                message: "success restore description data",
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                message: "internal server error", 
                error: error.message
            })
        }
    },
}
