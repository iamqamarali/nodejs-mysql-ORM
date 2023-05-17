import BaseModel from './BaseModel.js'

export default class Post extends BaseModel{
    table = 'users';

    properties = [
        'id',
        'first_name',
        'last_name',
        'bio',
        'email',
        'password',
        'created_at',
        'updated_at',
    ];

    static getTable(){
        return 'users';
    }

    /** */
    constructor(data = {}){
        super(data);
    }

    /**
     * 
     */
    async findOrCreate(){
        let user = await Post.find({ email : this.get('email') }, ['id'])
        if(user){
            this.set('id', user.id)
            Post.update(user.id, this.data);
            return user.id;
        }

        return await super.save();
    }

    /**
     * 
     */
    posts(){
        let sql = `SELECT * FROM posts WHERE user_id = ?`;
        return this.db.execute(sql, [this.get('id')])
    }

} 