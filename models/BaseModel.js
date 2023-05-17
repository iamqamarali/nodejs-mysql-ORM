import connection from '../database/useDatabase.js'


export default class BaseModel {

    db = connection;
    table = '';

    constructor(data = {}){
        this.data = data
    }
    
    /**
     * 
     * This function should always be overriden in child class
     */
    static getTable(){
        return this.table;
    }

    /**
     * 
     */
    fill(data){
        this.data = data
    }

    // set get any property
    set(key, value){
        this.data[key] = value;
    }

    get(key){
        return this.data[key];
    }


    /**
     * 
     * SQL query helpers
     */
    static getKeysForSetStatement(data){
        let str = "";
        for (const key in data) {
            str += `${key} = ? , `;
        }
        return str.slice(0, -2);
    }

    static getKeys(data){
        return Object.keys(data);
    }
    static getValues(data){
        return Object.values(data);
    }
    static getQuestionMarks(data){
        let str = Object.values(data).map( v => '?');
        return str.join(',');
    }


    /**
     * 
     * all 
     */
    static async all(select = null){
        let sql = `SELECT * FROM ${this.getTable()}`;
        if(select instanceof Array && select.length){
            sql = sql.replace('*', select.join(','));
        }
        const [rows, fields] = await connection.execute(sql);

        for (let i = 0; i < rows.length; i++) {
            rows[i] = new this(rows[i]);
        }
        return rows;
    }

    /**
     * 
     * @returns 
     */
    static async count(){
        const sql = `SELECT COUNT(*) as total FROM ${this.getTable()}`;
        const [rows, fields] = await connection.execute(sql);
        return rows[0]['total'];
    }

    /**
     * SAVE  
     * */
    async save(){
        if(!this.data.id){
            let result = await this.constructor.create(this.data);
            this.set('id', result[0]['insertId'])
            return this.get('id');
        } 
        let result = await this.update(this.data.id, this.data);
        return result[0]['changedRows'];
    }

    /**
     * 
     * */
    static async create(data){
        const sql = `INSERT INTO ${this.getTable()} SET `+ this.getKeysForSetStatement(data)
        return await connection.execute(sql, this.getValues(data));
    }
    
    /**
     *  
     * UPDATE
     * */
    static async update(id, data){
        const sql = `UPDATE ${this.getTable()} SET `+ this.getKeysForSetStatement(data)
                    +` WHERE id = ?`;
        return await connection.execute(sql, [ ...this.getValues(data) , id]);
    }


   /**
     * 
     * */
    static async find(query, select = null){

        if(typeof query === 'number'){
            query = { id : query }
        }
                
        let str = ''
        for (const key in query) {
            str += `${key} = ? AND `;
        }
        str = str.slice(0, -4);

        let sql = `SELECT * FROM ${this.getTable()} where ${str}`

        if(select instanceof Array ){
            sql = sql.replace('*', select.join(','));
        }

        const [rows, fields] = await connection.execute(sql, this.getValues(query));
        return rows[0];
    }



    /**
     *  
     * 
     * */
    static async delete(ids){        
        let sql = `DELETE FROM ${this.getTable()} WHERE id = ?`;
        if( ids instanceof Array && ids.length){
            sql = `DELETE FROM ${this.getTable()} WHERE id IN (${this.getQuestionMarks(ids)})`;
        }else{
            ids = [ids];
        }
        const [rows, fields] = await connection.execute(sql, [...ids]);
        return rows['affectedRows'];
    }


    /**
     * 
     */
    static async truncate(){
        const sql = `Delete From ${this.getTable()}`;
        const [rows, fields] = await connection.execute(sql);
        return rows['affectedRows'];
    }
    
}