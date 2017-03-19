Meteor.methods({
  "chats/sendMsg": function(msg) {
    App.Collections.Message.insert(msg);

    if (this.isSimulation) return;

    App.Services.Notification.sendGCMNotification(msg);
  },

  "chats/getHistory": function(targetId, oldestMsg, lastRead, isPublic, isNew) {
    if (this.isSimulation) return;

    // build selector
    var now = new Date();

    var selector = {
      is_public: isPublic,
      time: {
        $gt: oldestMsg > lastRead? lastRead: new Date(0)
      }
    };

    if (isNew) {
      selector.time.$lte = now;
    } else {
      selector.time.$lt = oldestMsg;
    }

    if (isPublic) {
      selector.receiver = targetId;
    } else {
      selector.sender = selector.receiver = {
        $in: [this.userId, targetId]
      };
    }

    // build return object
    var returnObj = {};

    // if sub for first time
    if (isNew || oldestMsg >= lastRead) {
      var cursor = App.Collections.Message.find(selector, { sort: {time: -1} });
      // maximun return 100
      if (cursor.count() > 100) {
        returnObj.leftNew = 100;
        cursor = App.Collections.Message.find(selector, { sort: {time: -1}, limit: 100 });
        returnObj.history = cursor.fetch();

      } else {
        returnObj.leftNew = cursor.count();
        returnObj.history = cursor.fetch();
        if (returnObj.leftNew)
          returnObj.history[returnObj.leftNew - 1].startNew = true;

        delete selector.time.$lte;
        delete selector.time.$gt;
        selector.time.$lte = lastRead;
        var olderMsg = App.Collections.Message.find(selector, { sort: {time: -1}, limit: 25 }).fetch();
        returnObj.history = returnObj.history.concat(olderMsg);
      }

    } else {
      returnObj.history = App.Collections.Message.find(selector, { sort: {time: -1}, limit: 25 }).fetch();
    }

    return returnObj;
  },

  "chats/getLastestMsg": function(tags, friends) {
    if (this.isSimulation) return;

    var lastestMsg = {};
    tags.forEach((tagId) => {
      var msg = App.Collections.Message.findOne({
        is_public: true,
        receiver: tagId
      }, {sort: {time: -1}});

      if (msg) lastestMsg[tagId] = msg;
    });
    friends.forEach((userId) => {
      var msg = App.Collections.Message.findOne({
        is_public: false,
        sender: {$in: [this.userId, userId]},
        receiver: {$in: [this.userId, userId]}
      }, {sort: {time: -1}});

      if (msg) lastestMsg[userId] = msg;
    });

    return lastestMsg;
  }
})
