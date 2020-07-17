<template>
    <b-card-group deck id="card">
        <b-card header="Free Employee">

          <b-list-group>
            <div v-if="free_list.length!=0">
            <perfect-scrollbar>
            <b-list-group-item id="col" v-for="(emp,id) in free_list" :key="id" >

                  Id:<span id="col-1">{{emp.empId}}</span>
                  <span id="namespace">Name:<span id="col-1">{{emp.name}}</span></span>

            </b-list-group-item>
            </perfect-scrollbar>
            </div>
            <div v-else id="nofree">No Employee is Free</div>
          </b-list-group>

        </b-card>
        <b-card header="Busy Employee">
          <b-list-group>
          <div v-if="busy_list.length!=0">
          <perfect-scrollbar>
          <b-list-group-item id="col" v-for="(emp,id) in busy_list" :key="id" >Id:<span id="col-1">{{emp.empId}}</span>
                <span id="namespace">Name:<span id="col-1">{{emp.name}}</span></span></b-list-group-item></perfect-scrollbar></div>
                <div v-else id="nofree">No Employee is busy</div>
          </b-list-group>


        </b-card>
    </b-card-group>
</template>

<script>
import { bus } from '../main'
import axios from 'axios'
const BASE_URL = 'http://localhost:3000';
  export default{
    // props:{
    //   change:Boolean
    // },
    data(){
        return{
          // free_list:[],
          // busy_list:[]
          employee_list:[]
        }
    },
    computed: {
    // a computed getter
      free_list: function () {
        //console.log(this.change+" computed");
        // `this` points to the vm instance
        return this.employee_list.filter(function (num) {
                      return num.status==true;})
      },
      busy_list:function(){
        return this.employee_list.filter(function (num) {
                      return num.status==false;})
      }
  },

    mounted() {
    // a computed getter
      //this.change=false
      //console.log(this.change+" mounted")
      var x='sort';
      var y='desk_pos';
          axios.get(`${BASE_URL}/api/${x}/${y}`)
            .then(response => {
              this.employee_list=response.data

            })
            .catch(error => {
              console.log(error)

            })

    },
    created (){
        bus.$on('changeIt', (data) => {
          this.employee_list = data;
        })
      }
    
  }

</script>

<style scoped>
.card-deck .card{
margin-top:40px;
}
#col{
  color: #495057;
}
#col:hover{
  background-color:#e6e0df
}
#nofree{
    color:#00cccc;
}
.ps {
  height: 400px;
}
#col-1{
  color:#28a745;
  margin-left:5px;
}
#namespace{
  margin-left:95px;
}

</style>
