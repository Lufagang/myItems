(function (Vue) {
    Vue.component("my-todos", {
        watch: {
            todos: {
                handler: function (newTodos, oldTodos) {
                    localStorage.setItem("todos", JSON.stringify(newTodos));
                },
                deep: true
            }
        },
        computed: {
            remaining: function () {
                let remainTodos = this.todos.filter(v => {
                    return !v.active
                })
                return remainTodos.length;
            },
            filterTodos: function () {
                if (this.visibility === "all") {
                    return this.todos;
                } else if (this.visibility === "active") {
                    return this.todos.filter((v) => {
                        return !v.active;
                    })
                } else {
                    return this.todos.filter((v) => {
                        return v.active;
                    });
                }
                return this.todos;
            }
        },
        data:function(){
            return {
                content: '',
                title: "",
                allChecked: false,
                visibility: "all",
                edit_index: -1,
                todos: JSON.parse(localStorage.getItem("todos") || "[]"),
            }
        },
        methods: {
            removeCompleteTodo: function () {
                let unfinished_item = this.todos.filter(v => {
                    return !v.active
                })
                this.todos = unfinished_item;
            },
            handleItemClick: function (visibility) {
                this.visibility = visibility;
            },
            saveTodos: function () {
                if (this.content.trim() == '') {
                    alert("输入不能为空")
                    return false;
                }
                this.todos.push({
                    id: Date.now(),
                    text: this.content,
                    active: false
                })
                this.content='';

            },
            // 全选、反选方法
            handleAllCheck: function () {
              if(this.allChecked==""){
                  this.allChecked=true;
                  this.todos.forEach((v)=>{
                    v.active=true;
                })
              }else{
                  this.allChecked=false;
                  this.todos.forEach((v)=>{
                    v.active=false;
                  })
             
              }
            },
            saveEditTodo: function (index) {
                if (!this.todos[index].text||this.enter==true) {
                    this.todos.splice(index, 1);
                }
                this.edit_index = -1;
            },
            // 删除方法
            deleteTodos: function (index) {
                this.todos.splice(index, 1);
            },
            editTodo: function (index) {
                this.edit_index = index;
            },
        },
        template: `
        <div class="todos-content">
        <div class="app-todos-content">
        <div class="app-todos-header">
            <div :class="[{'todos-header-left':true},{checkClass:allChecked}]"  @click.stop="handleAllCheck">
            checkall 
            </div>
            <div class="todos-header-right">
                <input type="text" @keyup.enter="saveTodos" v-model="content" placeholder="输入完成请按回车"/>
            </div>
        </div>
    </div>
        <div class="app-todos-list">
        <div class="todos-list-item" v-for="(item,index) in filterTodos">
            <div class="list-item-left" >
                <input type="checkbox" v-model="item.active">
            </div>
            <div class="list-item-mid" @dblclick.stop="editTodo(index)">
                <input type="text" :class="[{hidden_input:edit_index != index}]" @blur="saveEditTodo(index)" v-model="item.text" @keyup.enter="saveEditTodo(index)">
                <span :class="[{hidden_input:edit_index==index},{title:true},{completed:item.active}]">{{item.text}}</span>
            </div> 
            <div class="list-item-right">
                <span class="delete" @click="deleteTodos(index)">X</span>
            </div> 
        </div>
    </div>
    <div class="app-todos-bottom">
    <div class="todos-bottom-left">剩下{{this.remaining}}项</div>
    <div class="todos-bottom-mid">
        <span :class="[{'bottom-mid-item':true},{active:visibility=='all'}]" @click="handleItemClick('all')">All</span>
        <span :class="[{'bottom-mid-item':true},{active:visibility=='active'}]" @click="handleItemClick('active')">待办事项</span>
        <span :class="[{'bottom-mid-item':true},{active:visibility=='completed'}]" @click="handleItemClick('completed')">已完成</span>
    </div>
    <div class="todos-bottom-right" @click.stop="removeCompleteTodo">清除已完成</div>
    </div>
    </div> `
    })
})(Vue)