Meteor.methods({
  "chats/sendMsg": function(msg) {

    App.Collections.Message.insert(msg);
  },

  "chats/getHistory": function(targetId, lastRead, joinTime, isPublic, isNew) {
    if (this.isSimulation) return;

    console.log(JSON.stringify(arguments, undefined, 2));

    // build selector
    var now = new Date();
    if (!lastRead) lastRead = now;
    var selector = {
      is_public: isPublic,
      time: {
        $lte: isNew? now: lastRead,
        $gt: isNew? lastRead: (joinTime? joinTime: new Date(0))
      }
    };

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
    if (isNew) {
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
        console.log(JSON.stringify(selector, undefined, 2));
        console.log(JSON.stringify(returnObj.history, undefined, 2));
        if (returnObj.leftNew)
          returnObj.history[returnObj.leftNew - 1].startNew = true;

        selector.time.$lte = lastRead;
        selector.time.$gt = joinTime;
        console.log(JSON.stringify(selector, undefined, 2));
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
