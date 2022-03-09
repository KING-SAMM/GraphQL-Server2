const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');
const _ = require('lodash');


const authors = [
    { id: 1, name: 'J. K. Rowling' },
    { id: 2, name: 'J. J. Tolkien' },
    { id: 3, name: 'K. C. Samm' }
];

const books = [
    { id: 1, title: 'Harry Porter and the Chamber of Secrets', authorId: 1 },
    { id: 2, title: 'Harry Porter and the Prosoner of Azkaban', authorId: 1 },
    { id: 3, title: 'Harry Porter and the Goblet of Fire', authorId: 1 },
    { id: 4, title: 'The Fellowship of the Ring', authorId: 2 },
    { id: 5, title: 'The Two Towers', authorId: 2 },
    { id: 6, title: 'The Return of the King', authorId: 2 },
    { id: 7, title: 'Legend of the Curse', authorId: 3 },
    { id: 8, title: 'Shadows of Hades', authorId: 3 }
];

const BookType = new GraphQLObjectType({
    name: 'BookType',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLString },
        authorId: { type: GraphQLInt },
        author: {
            type: AuthorType,
            resolve(parent, args)
            {
                return _.find(authors, { id: parent.authorId } )
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'AuthorkType',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args)
            {
                return _.filter(books, { authorId: parent.id })
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    description: 'Root query type',
    fields: () => ({
        book: {
            type: BookType,
            description: 'Get a specific book by id',
            args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
            resolve(parent, args) {
                return _.find(books, { id: args.id })
            }
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'Get a list of all books',
            resolve: () => books 
        },
        author: {
            type: AuthorType,
            description: 'Get a specific author by id',
            arge: { id: { type: new GraphQLNonNull(GraphQLInt) } },
            resolve(parent, args) {
                return _.find(authors, { id: args.id })
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'Get a list of all authors',
            resolve: () => authors
        }
    })
});

module.exports = new GraphQLSchema({
    query: RootQueryType
})