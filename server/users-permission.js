/**
 * Created by thomas on 30/04/15.
 */
Users.allow({
    insert : function (userId) {
        return (userId);
    },
    update : function (userId) {
        return userId;
    },
    remove : function (userId, doc) {
        return doc.owner === userId;
    }
});