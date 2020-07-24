<template>
    <div>
        <b-tabs
        active-nav-item-class="font-weight-bold text-uppercase text-danger"
        active-tab-class="font-weight-bold text-success"
        content-class="mt-3"  align="center">
            <b-tab title="Employee Status" active><slot>
            <window /><br><br><hr><a id = "GFG" href="#li1"><p id="stat">Status of Employee</p></a>
            <list id="li1" />
            </slot></b-tab>
            <b-tab title="Record"><slot><record/></slot></b-tab>
            <b-tab title="Desk Position" ><slot>
                <sheet/>
            </slot></b-tab>
        </b-tabs>
    </div>
</template>

<script>
import window from './window.vue'
import list from './list.vue'
import sheet from './desk.vue'
import record from './table.vue'

    export default{

        components: {
          window,
          list,
          sheet,
          record

        },
        
        

    }




</script>

<style scoped>
#myBtn {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 30px;
  z-index: 99;
  font-size: 18px;
  border: none;
  outline: none;
  background-color: red;
  color: white;
  cursor: pointer;
  padding: 15px;
  border-radius: 4px;
}
#GFG{
  text-decoration:none;
}
#stat{
  text-align:center;
  font-size:1.5rem;
}
#myBtn:hover {
  background-color: #555;
}
</style>
