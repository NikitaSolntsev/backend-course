import Post from "../Models/Post.js";

const throwError = ( res, message, errors = {}) => {
    res.status(500).json({ message: message, errors})
}

class PostController{
    async create (req, res){

        try{

            const { title, description } = req.body;

            const errors = {}

            if ( !title ){
                errors.title = 'Укажите название поста';
            }

            if ( !description ){
                errors.description = 'Укажите описание поста';
            }
            if ( Object.keys(errors).length ){
                throwError( res, 'Есть незаполненные поля', errors );
            }else{
                const post = await Post.create( { title, description } );
                res.status(200).json( { message: `Пост с заголовком ${title} добавлен`} )
            }

        }catch(err){
            throwError(res, 'Ошибка сервера');
        }
    }

    async getAll (req, res){
        try{
            const posts = await Post.find()
            res.status(200).json( { body : posts } )
        }catch (err){
            throwError(res, 'Ошибка сервера');
        }
    }
    async getOne (req, res){
        try{
            const {id} = req.params;
            const post = await Post.findById(id);
            res.status(200).json( { body : post } )
        }catch (err){
            throwError(res, 'Ошибка сервера');
        }
    }
    async update (req, res){
        try{
            const post = req.body;

            const updatedPost = await Post.findByIdAndUpdate(post.id, post, {new : true});

            if ( !updatedPost ){
                throwError(res, `Пост с ${post.id} не найден` );
            }

            res.status(200).json( { message: `Пост с id ${post.id} изменен`, body : updatedPost} )

        }catch (err){
            throwError(res, 'Ошибка сервера');
        }
    }
    async delete (req, res){
        try{
            const {id} = req.params;

            if ( !id ){
                throwError(res, 'Не указан id удаляемого поста');
                return;
            }

            const deletedPost = await Post.findByIdAndDelete(id);

            res.status(200).json( { message: `Пост с id ${id} удален` } )

        }catch (err){
            throwError(res, 'Ошибка сервера');
        }
    }
}

export default new PostController()