Router.configure({
  layoutTemplate: 'main'
});

Todos = new Meteor.Collection('todos');
Lists = new Meteor.Collection('lists');

Router.route('/register');
Router.route('/login');
Router.route('/', {
  name: 'home',
  template: 'home'
});
Router.route('/list/:_id', {
  template: 'listPage',
  data: function(){
    var currentList = this.params._id;
    return Lists.findOne({ _id: currentList });
  }
});

if(Meteor.isClient){
  Template.todos.helpers({
  'todo': function(){
    var currentList = this._id;
    return Todos.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.todoItem.helpers({
    'checked': function(){
      var isCompleted = this.completed;
      if(isCompleted){
        return "checked";
      } else {
        return "";
      }
    }
  });

  Template.todosCount.helpers({
    'totalTodos': function(){
      return Todos.find().count();
    },
    'completedTodos': function(){
      return Todos.find({completed: true }).count();
    }
  });

  Template.lists.helpers({
    'list': function(){
      return Lists.find({}, {sort: {name: 1}});
    }
  })

  Template.addList.events({
    'submit form': function(event){
      event.preventDefault();
      var listName = $('[name="listName"]').val();
      Lists.insert({
        name: listName
      });
      $('[name=listName]').val('');
    }
  });

  Template.addTodo.events({
    'submit form': function(event){
      event.preventDefault();
      var todoName = $('[name="todoName"]').val();
      Todos.insert({
        name: todoName,
        completed: false,
        createdAt: new Date(),
        listId: currentList
      });
      $('[name="todoName"]').val('');
    }
  });

  Template.todoItem.events({
    'click .delete-todo': function(event){
      event.preventDefault();
      var currentList = this._id;
      var documentId = this._id;
      var confirm = window.confirm("Delete this shit for real?");
      if(confirm){
        Todos.remove({ _id: documentId });
      }
    },
    'keyup [name=todoItem]': function(event){
      if(event.which == 13 || event.which == 27){
        $(event.target).blur();
      } else {
      var documentId = this._id;
      var todoItem = $(event.target).val();
      Todos.update({ _id: documentId }, {$set: {name: todoItem }});
      console.log(event.which);      
    }
  },
  'change [type=checkbox]': function(){
    var documentId = this._id;
    var isCompleted = this.completed;
    if(isCompleted){
      Todos.update({ _id: documentId }, {$set: { completed: false }});
      console.log("Task is incomplete jabroni");
    } else {
      Todos.update({ _id: documentId }, {$set: {completed: true }});
      console.log("Task is complete ma fucka");
    }
  }
  })
}

if(Meteor.isServer){

}




