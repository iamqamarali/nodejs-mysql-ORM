import BaseModel from './BaseModel.js'

export default class Post extends BaseModel{
    table = 'posts';

    properties = [
        'id',
        'title',
        'body',
        'main_image',

        'user_id',

        'created_at',
        'updated_at ',
    ];

    static getTable(){
        return 'posts';
    }

    /** */
    constructor(data = {}){
        super(data);
    }

    user(){
        let result = this.db.execute(`SELECT * FROM users WHERE id = ? LIMIT 1 `, [this.user_id]);
        return result[0];
    }

} 