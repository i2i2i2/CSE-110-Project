Meteor.methods({
  "chats/sendMsg": function(msg) {

    App.Collections.Message.insert(msg);
  },

  "chats/getHistory": function(targetId, oldestMsg, lastRead, joinTime, isPublic, isNew) {
    if (this.isSimulation) return;

    console.log(JSON.stringify(arguments, undefined, 2));

    // build selector
    var now = new Date();

    var selector = {
      is_public: isPublic,
      time: {
        $lte: isNew? now: oldestMsg,
        $gt: oldestMsg > lastRead? lastRead: (joinTime? joinTime: new Date(0))
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
    if (isNew || oldestMsg > lastRead) {
      var cursor = App.Collections.Message.find(selector, { sort: {time: -1} });
      // maximun return 100
      if (cursor.count() > 100) {
        returnObj.leftNew = 100;
        cursor = App.Collections.Message.find(selector, { sort: {time: -1}, limit: 100 });
        returnObj.history = cursor.fetch();

        console.log("leftNew")

      } else {
        returnObj.leftNew = cursor.count();
        returnObj.history = cursor.fetch();
        if (returnObj.leftNew)
          returnObj.history[returnObj.leftNew - 1].startNew = true;

        delete selector.time.$lt;
        selector.time.$lte = lastRead;
        selector.time.$gt = joinTime;
        var olderMsg = App.Collections.Message.find(selector, { sort: {time: -1}, limit: 25 }).fetch();
        returnObj.history = returnObj.history.concat(olderMsg);

        console.log("no left new")
      }

    } else {
      returnObj.history = App.Collections.Message.find(selector, { sort: {time: -1}, limit: 25 }).fetch();
    }

    console.log(returnObj.history.length);

    return returnObj;
  }
})
