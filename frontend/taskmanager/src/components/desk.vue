<template>
  <v-container>
    <v-row justify="space-around">
      <v-col class="sheets"
      v-for="lis in employee_list" :key="lis"
        :class="`elevation-${hover ? 24 : 6}`"
        cols="12"
        md="4"
      >
      <div class="text-center">
        <v-sheet
            class="pa-12"
            color="grey lighten-3" max-height="100px" min-height="40px"
          >
            <div id="name">{{lis.name}}</div><hr>
            <span id="col1">Emp. Id :</span>{{lis.empId}}<br>
            <span id="col1">Desk Pos.:</span> {{lis.desk_pos}}<br>
            <span id="col1">Projects</span><br>
            <perfect-scrollbar><div v-for="(work,id) in lis.work" :key="id" id="proj">{{work.project}}</div></perfect-scrollbar>
        </v-sheet>
      </div>

      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import axios from 'axios'
import { bus } from '../main'
const BASE_URL = 'http://localhost:3000';
  export default {
    //new Vue({
      //el: '#app',
      //vuetify: new Vuetify(),
      data(){
        return {
          //elevations: 20
          employee_list:[],
        }
    },
    mounted() {
          var x='sort';
          var y='desk_pos';
          axios.get(`${BASE_URL}/api/${x}/${y}`)
            .then(response => {
              this.employee_list=response.data
              //console.log(this.employee_list)
            })
            .catch(error => {
              console.log(error)
            })

    },
    created (){
        bus.$on('changeIt', (data) => {
          this.employee_list = data;
          //console.log(this.employee_list)
        })
      }

  }
</script>
<style scoped>
* {
    padding: 0;
    margin: auto;

}
#col1{
  color:#e07870;
}
#name{
  color:#2d81cf;
  font-size:20px;
}
.ps {
  height: 100px;
}
.sheets:hover{
  border-radius:20px;
  box-shadow:20px 20px 20px  #bee396;
}
.sheets{
  color:green;
  border-radius:10px;
  box-shadow:10px 10px 10px  #bee396;
  height:250px;
  margin-left:50px;
  margin-top:50px;


}
</style>
