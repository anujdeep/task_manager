<script>
import { Line } from 'vue-chartjs'
import axios from 'axios'
import { bus } from '../main'

const BASE_URL = 'http://localhost:3000';
export default {
  extends: Line,
  //props: ['data'],
  data(){
    return{
      compTime:[],
    }
  },
  mounted () {
    bus.$on('showgh', (data) => {
    axios.get(`${BASE_URL}/api/time2/${data}`)
    .then(response => {
      this.compTime=response.data

      this.renderChart({
        labels: this.compTime[0].empid,


        datasets: [
          {
            label: 'Days to complete '+ this.compTime[0]._id,
            backgroundColor: '#b4d4b2',
            borderColor:'#658efe',
             data: this.compTime[0].time ,
             
          }
        ],

      })
    })
    .catch(error => {
      console.log(error)

    })
  })

}

}
</script>
