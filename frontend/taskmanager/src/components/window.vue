<template>
  <div id="window">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">

      <b-form-group id="input-group-1" label="Employee Id:" label-for="input-1">
        <b-form-input
          id="input-1"  :disabled="validated == 1"
          v-model="form.empId" @keyup.enter="former();" @keydown.enter="call"
          type="text"
          required
          placeholder="Enter Employee Id"
        ></b-form-input>
      </b-form-group>

      <div v-if="form.formerEmployee.length==0">
      <b-form-group id="input-group-2" label="Employee Name:" label-for="input-2" v-if="form.view"
      >
        <b-form-input
          id="input-2"
          v-model="form.name"
          @keyup.enter="nextshow2()" @keydown.enter="call"
          type="text"
          required
          placeholder="Enter name"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Work:" label-for="input-3" v-if="form.view"
      >
        <b-form-input
          id="input-3"
          v-model="form.work"
          @keyup.enter="nextshow3()" @keydown.enter="call"
          type="text"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Desk Position:" label-for="input-4"  v-if="form.view">
        <b-form-input
          id="input-4" @keyup="changeToggle();"  @keyup.enter="nextshow4();" @keydown.enter="call"
          v-model="form.deskpos"
          type="number"  min="0"
          required
        ></b-form-input>

      </b-form-group>



      <b-button  @click="onSubmit();" v-b-modal.modal-center type="submit" variant="primary" id="sub1"
       v-if="myToggle">
      Submit</b-button>

      <b-modal ref="my-modal" id="modal-center" centered hide-footer title="Results" >
          <div class="my-4" text-align="center"><p v-if="errVal">Invalid inputs! Please check</p>
          <p v-else>{{form.name}} {{form.empId}}</p></div>
          <b-button class="mt-3" variant="outline-danger" id="modcol" block @click="hideModal();onReset();">Close Me</b-button>
      </b-modal>


      <b-button type="reset" variant="danger" v-if="form.view">Reset</b-button>
      </div>

      <div v-else>
        <ul>
            <li v-for="(emp,id) in form.formerEmployee" :key="id">
            <p id="detail">Details of Employee Id:{{emp.empId}}</p>
            <span id="detail-1">Name:</span> {{emp.name}} <br> <span id="detail-1">Desk No:</span> {{emp.desk_pos}}<br>
            <p id="detail-1">Projects inprogress:</p>
            <ul v-if="uncompletedTask.length!=0">
                <li v-for="(work1,id1) in uncompletedTask" id="dlist" :key="id1" >
                <span class="pro" id="id1" v-b-tooltip.hover.right title="Double click to mark this task as complete"
                @dblclick="finishTask(work1.project,emp.empId,id)">
                {{work1.project}}</span>

                  <!--<unicon name="edit" fill="#333" :width="15" :height="15" />-->
                </li>
				<b-modal ref="errorwork" id="my-modal1" centered hide-footer><div>Error Occured! try Again</div>
				<b-button class="mt-3" variant="outline-danger" id="modcol" block @click="hideModal1()">Close Me</b-button>
				</b-modal>
            </ul>
            <ul v-else>None</ul>
            <p id="detail-1">Projects completed:</p>
            <ul v-if="completedTask.length!=0">
                <li v-for="(work1,id1) in completedTask" id="dlist-1" :key="id1">
                {{work1.project}} {{work1.complete_time | moment("from", work1.start_time) }}</li>
            </ul>
            <ul v-else id="dlist-1">None</ul>
            </li>
        </ul>
        <b-form-group id="input-group-3" label="Work:" label-for="input-3" v-if="form.newWork"
        >
          <b-form-input
            id="input-3"
            v-model="form.work"
            @keyup.enter="nextshow3()" @keydown.enter="call"
            type="text"
            required
          ></b-form-input>
        </b-form-group>
        <span v-if="form.newWork">
        <b-button  @click="assignWork();" v-b-modal.modal-cen type="submit" variant="primary" id="sub1"
         >
        Submit</b-button>
        <b-modal ref="my-modal" id="modal-cen" centered hide-footer title="Successfully updated" >
            <p >{{form.empId   }} {{form.work}} </p>
            <b-button class="mt-3" variant="outline-danger" id="modcol" block @click="hideModal();onReset();">Close Me</b-button>
        </b-modal>
        </span>

        <span v-else>
        <b-button  variant="success"  @click="edit()" id="sub2" >Assign new work</b-button>
        <b-button  variant="success" id="del-1"  @click="deleteEmployee()"  >Delete current Employee record</b-button>
        </span>
        <b-button type="reset" variant="danger" v-if="form.view">Reset</b-button>

      </div>


    </b-form>

    <br>
    <hr>

  </div>
</template>

<script>
import axios from 'axios'
import { bus } from '../main'

const BASE_URL = process.env.VUE_APP_BASE_URL
  export default {
    data() {
      return {
        form: {
          empId: '',
          name: '',
          deskpos: '',
          work: '',
          view:false,
          formerEmployee:[],
          newWork:false,


        },
        showicon:false,
        completedTask:[],
        uncompletedTask:[],
        validated:0,
        employee_list:[],
        val:0,
        myToggle:false,
        errVal:false,

        show: true
      }
    },
    methods: {

      finishTask(pro,id){
          var val=this.uncompletedTask.splice(this.uncompletedTask.findIndex(function(i){
              return i.project ==pro;
          }), 1);

          this.completedTask.push({project:val[0].project});
          
        axios.post(`${BASE_URL}/api/finish/${id}/${pro}`)
        .then(res=>{
          console.log(res.data)
          this.getEmployee();
        })
        .catch(err=>{this.$refs['errorwork'].show()
          console.log(err);
        })
      },
      getEmployee(){
        var x='sort';
        var y='desk_pos';
        axios.get(`${BASE_URL}/api/${x}/${y}`)
          .then(response => {
            this.employee_list=response.data
            bus.$emit('changeIt', this.employee_list);
          })
          .catch(error => {
            console.log(error)

          })
      },
      assignWork(){
        if(this.form.work!=''){
            axios.post(`${BASE_URL}/api/insert`,this.form)
            .then(res=>{
              this.getEmployee();
              console.log(res);
            })
            .catch(err=>{
              console.log(err);
            })
        }
      },
      deleteEmployee(){
        this.$confirm("Are you sure?").then(() => {
          var x=parseInt(this.form.empId);
          axios.delete(`${BASE_URL}/api/del/${x}`)
            .then((res) => {
              this.getEmployee();
              // this.form.formerEmployee=res.data
              console.log(res);
            })
            .catch((err) => {
              console.log(err.data);
            })
            this.onReset();
        });

      },
      edit(){
        this.form.newWork=true
        
      },
      former(){
        var x=parseInt(this.form.empId);
        this.validated=1;
        console.log(BASE_URL);
        axios.get(`${BASE_URL}/api/search/${'empId'}/${x}`)
          .then((res) => {
            this.form.formerEmployee=res.data
            this.completedTask=this.form.formerEmployee[0].work.filter((val)=>{
                return val.complete_time!=null;
            })
            this.uncompletedTask=this.form.formerEmployee[0].work.filter((val)=>{
                return val.complete_time==null;
            })

          })
          .catch((err) => {
            console.log(err.data);
          })
          if(this.form.formerEmployee.length==0)
          this.showForm();

          else {
              document.getElementById('sub2').focus()


          }
      },
      call(e){
        e.preventDefault()
      },
      nextshow1(){
        document.getElementById('input-2').focus()
      },
      nextshow2(){
        document.getElementById('input-3').focus()
      },
      nextshow3(){
        document.getElementById('input-4').focus()
      },
      nextshow4(){
        
        
        document.getElementById('sub1').focus()

      },
      showModal() {
      
      
        this.$refs['my-modal'].show()
      },
      hideModal() {
        this.errVal=false
        this.$refs['my-modal'].hide()
        this.getEmployee();
      },hideModal1(){this.$refs['errorwork'].hide()},
      changeToggle(){
        this.myToggle=true
        //this.nextshow4();
      },
      showForm(){
          if(this.form.empId.length!=0){
            this.form.view=true
            //check for existence of empId
            this.nextshow1()
          }
          else{
            this.form.view=false
          }
      },
      onSubmit(evt) {
        evt.preventDefault()
        
        if((this.form.name!="" && this.form.deskpos!="" && this.form.work!="" && typeof(this.form.name)=='string' && 
		isNaN(this.form.name) && typeof(Number(this.form.deskpos))=='number')){
          let newEmployee={
            empId:this.form.empId,
            name:this.form.name.toUpperCase(),
            deskpos:this.form.deskpos,
            work:this.form.work,
          };this.errVal=false;

          console.log(newEmployee);
          axios.post(`${BASE_URL}/api/insert`,newEmployee)
          .then(res=>{
            console.log(res);
            this.getEmployee();
          })
          .catch(err=>{
            console.log(err);
          })

        }
        else{
          this.errVal=true;
        }
		
		this.showModal();
      },
      onReset() {
        //evt.preventDefault()
        // Reset our form values
        this.form.empId = ''
        this.form.name = ''
        this.form.deskpos = ''
        this.form.work= ''
        this.form.newWork=''
        this.form.view=false
        this.myToggle=false
        this.form.formerEmployee=[]
        this.validated=0
        //this.change=false
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.errVal=false
        this.$nextTick(() => {
          this.show = true
        })
      }
    },

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*{
  box-sizing:border-box;
  margin: initial;
  padding: 0;
}

.pro:hover{
  color:#007bff;
}
#modcol{
  background-color:#ed3758;
}
#window{
  display:flex;
  justify-content:center;
  align-items:center;
}
#del-1{
  background-color:#007bff;
}
#detail{
  font-weight:155px;
  font-size:1.5rem;
  color:#007bff;
}
#detail-1{
  color:#495057;
}
.btn{
  margin:30px;
  border:none;
  opacity:0.8;
  color:white;
}
ul{
  list-style-type:none;
}
#dlist{
  list-style-type:disc;
  cursor:pointer;

}

#dlist-1{
  list-style-type:disc;
  color:red;

}
[data-v-379da400]{
  padding:revert;
}
.btn[data-v-379da400]{
  margin-left:35px;
  margin-top:55px;
}
input{
  border:none;
  border-bottom:2px solid #555;
  outline:none;
}
input:focus {
  border:none;
  border:3px solid #555;
  outline:none;
}
.btn:hover{
  box-shadow: 2px 2px grey;
  opacity:1.0;
}
.btn-block {
    display: block;
    width: 90%;
}

</style>
