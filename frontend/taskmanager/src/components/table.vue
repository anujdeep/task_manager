<template>
  <v-data-table
    :headers="headers"
    :items="employee_list"
    :single-expand="singleExpand"
    :expanded.sync="expanded"
    item-key="empId"
    show-expand @click:row="clicked"
    class="elevation-1"  :search="search"
  >
    <template v-slot:top>
      <v-toolbar flat>
      <b-dropdown id="dropdown-1" size="sm" dropright :text="droptitle" class="m-2" variant="outline-dark"  >

          <b-dropdown-item-button  @click="inprog">Inprogress Projects</b-dropdown-item-button>
          <b-dropdown-item-button @click="compl" >Completed Projects</b-dropdown-item-button>
          <b-dropdown-item-button  @click="getEmployee" >No Filter</b-dropdown-item-button>
      </b-dropdown>
        <v-spacer></v-spacer>

        <b-button @click="getproavg"  variant="outline-dark" size="sm" v-b-modal.modal-cent >Statistics</b-button>
        <b-modal ref="my-modal" id="modal-cent"  scrollable hide-footer title="Average time for completing projects" >

            <p v-for="(work,id) in proavg" :key="id" @click="showgraph(work._id)" id="desig"
             v-b-tooltip.hover.left title="click to show graph">
            {{work._id}}: {{parseInt(work.dayssince)}} days</p>

            <char /><div id="nam3">Employee Id</div>

            <b-button class="mt-3" variant="outline-danger" id="modcol" block @click="hideModal();">Close Me</b-button>
        </b-modal>
          <v-spacer></v-spacer>
        <v-text-field
        v-model="search" id="instyle"
        append-icon="mdi-magnify"
        label="Search By Name , Desk Position or Id"
        single-line
        hide-details
      ></v-text-field>

      </v-toolbar>
    </template>
    <tr @click="getaverage(item.empId)"></tr>
    <template v-slot:expanded-item="{ headers, item }" >
      <td :colspan="headers.length" id="col1">

      <div v-for="(val,id) in item.work" :key=id>
        <span v-if="val.complete_time!=null && (filter1==0 || filter1==2)" id="comp">
        {{val.project }}  completed {{val.complete_time | moment("from", val.start_time) }}</span>
       </div>
       <div v-for="(val,id) in item.work" :key=id>
            <span v-if="val.complete_time==null && (filter1==0 || filter1==1)" id="uncomp" @dblclick="finishTask(val.project,item.empId)"
        v-b-tooltip.hover.right title="Double click to mark this task as complete">
       {{val.project }}  inprogress from {{new Date()| moment("from", val.start_time,true)}}
       </span></div>
       <div >Average: {{item.average}} days</div>
      </td>
    </template>

  </v-data-table>
</template>


<script>
import { bus } from '../main'
import axios from 'axios'
import char from './chart.vue'
const BASE_URL = 'http://localhost:3000';
  export default {
    data () {
      return {
        search: '',
        expanded: [],
        singleExpand: true,
        headers: [
          {
            text: 'Name',
            align: 'start',
            sortable: true,
            value: 'name',
          },
          { text: 'Employee Id', value: 'empId' },

          { text: 'Desk Position', value: 'desk_pos' },


          { text: 'Projects', value: 'data-table-expand' },
        ],
        employee_list: [],
        original_list:[],
        filter1:0,
        filter2:0,
        change:0,

        droptitle:'filter',
        proavg:[],

      //  average:[],
      }
    },
    components:{
      char,
    },
    methods:{
      showgraph(val){
        //this.shgraph=1
        bus.$emit('showgh', val);
      },
      clicked(value) {
        this.expanded.push(value)
        //this.getaverage();
      },
      showModal() {
        this.$refs['my-modal'].show()
      },
      hideModal() {

        this.$refs['my-modal'].hide()
      },
      getproavg(){
        axios.get(`${BASE_URL}/time1`)
          .then(response => {
            this.proavg=response.data

            //bus.$emit('showgh',this.proavg[0]._id)
            console.log(this.proavg);
          })
          .catch(error => {
            console.log(error)

          })


      },

      finishTask(pro,id){

        axios.post(`${BASE_URL}/finish/${id}/${pro}`)
        .then(res=>{
          this.change=1
          this.getEmployee();
          console.log(res);
          //this.getEmployee();
        })
        .catch(err=>{
          console.log(err);
        })
      },
      inprog(){
        this.filter1=1;
        this.droptitle='Inprogress'
        //this.getEmployee();
          //console.log(this.employee_list)
        this.employee_list=this.original_list.filter(function (num) {
                      //return num.work.includes(num.work.complete_time==null)})
                      return num.status==false;
                    })
        //console.log(this.employee_list)

      },
      compl(){
        this.filter1=2;
          this.droptitle='Completed'
          //this.getEmployee();
          this.employee_list=this.original_list.filter((num)=>{
            return num.work.some(vendor => vendor['complete_time'] != null )
             })//some and every
 //                        return (num.work.filter((val)=>{
 //   return (val.comp!=null)
 // }))})
          //console.log(this.employee_list)

      },
       getEmployee(){
         this.filter2=this.filter1;
        this.filter1=0;
        this.droptitle='filter'
        var x='sort';
        var y='desk_pos';
         axios.get(`${BASE_URL}/${x}/${y}`)
          .then(response => {
            this.employee_list=response.data
            this.original_list=response.data

            bus.$emit('changeIt', this.original_list);
          })
          .catch(error => {
            console.log(error)

          })
      },
    },
    mounted() {
      this.droptitle='filter'
      var x='sort';
      var y='desk_pos';
          axios.get(`${BASE_URL}/${x}/${y}`)
            .then(response => {
              this.employee_list=response.data
              this.original_list=response.data
            })
            .catch(error => {
              console.log(error)

            })
            axios.get(`${BASE_URL}/time`)
              
              .catch(error => {
                console.log(error)

              })

    },
    created (){
        bus.$on('changeIt', (data) => {
          var w=this.filter2;
          this.employee_list = data;
          this.droptitle='filter'
          this.original_list=data
          if(w==1 && this.change==1){
            this.change=0;
            this.inprog();
          }
          axios.get(`${BASE_URL}/time`)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
              console.log(error)

            })
          this.filter2=0;
          this.change=0;
        })
      }
  }
</script>
<style scoped>
#instyle{
  width:100px;
}
#holder{
  color:#e38da5;
}
#nam3{
  text-align:center;
  font-size:10px;
  color:#555;
}
#comp{
  color:#787449;
  margin-left:20px;
}
#uncomp{
  color:#8ca35a;
  margin-left:20px;
  cursor:pointer;
}
#col1{
  color:#1c2e21;
}
.v-data-table-header{

    color: cornflowerblue;
}
#desig{
  cursor:pointer;
}
#desig:hover{
  color: cornflowerblue;
}
#filt{
  width:80px;
}
</style>
