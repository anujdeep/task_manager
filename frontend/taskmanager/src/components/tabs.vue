<template>
    <div>
        <b-tabs
        active-nav-item-class="font-weight-bold text-uppercase text-danger"
        active-tab-class="font-weight-bold text-success"
        content-class="mt-3"  align="center">
            <b-tab title="Employee Status" active><slot>
            <window /><br><br><hr><a id = "GFG" href="#li1"><p id="stat">Status of Employee</p></a>
            <list id="li1" />
            <button @click="topFunction()" id="myBtn" title="Go to top">Top</button>
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
        methods:{
           topFunction() {
              document.body.scrollTop = 0
              document.documentElement.scrollTop = 0
          },
          // updList(){
          //   this.val=true
          // }
        },
        created(){
                var mybutton = document.getElementById("myBtn");

            // When the user scrolls down 20px from the top of the document, show the button
            window.onscroll = function() {scrollFunction()};

            function scrollFunction() {
              if (document.body.scrollTop > 5 || document.documentElement.scrollTop > 5) {
                mybutton.style.display = "block";
              } else {
                mybutton.style.display = "none";
              }
            }
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
