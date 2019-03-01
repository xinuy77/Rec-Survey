<template>
    <v-flex xs12 sm6 offset-sm3>
         <v-card id="card">
          <v-card-title primary-title>
            <div>
                <h3 class="headline mb-0">Please read following passage below within {{timer_min}} minutes and {{timer_sec}} seconds.</h3>
            </div>
            <div id="passage">
                <!--<br>
                My Grandfather 
                <br><br>
                You wish to know all about my grandfather.  Well, he is nearly 93 years old, yet he still thinks as swiftly as ever.  He dresses himself in an ancient, black frock coat, usually minus several buttons.
                <br><br>
                A long, flowing beard clings to his chin, giving those who observe him a pronounced feeling of the utmost respect.  When he speaks his voice is just a bit cracked and quivers a trifle.  Twice each day he plays skillfully and with zest upon a small organ.
                <br><br>
                Except in the winter when the snow or ice prevents, he slowly takes a short walk in the open air each day. We have often urged him to walk more and smoke less but he always answers, ""Banana oil!""  Grandfather likes to be modern in his language.
                        -->
                {{passage}}
              </div>
            </v-card-title>
          </v-card>
        </v-flex>

       <!--
    <v-flex xs12 sm6 offset-sm3>
      <v-card id="card">
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Please speak out and describe following picture below.</h3>
          </div>
        </v-card-title>
        <v-img
          :src="require('./assets/cookietheft.jpg')"
         
        ></v-img>
      </v-card>
    </v-flex>
     -->
</template>

<script>
  export default {
    name: 'Card',
    data() {
      return {
        timer_min: 2,
        timer_sec: 0,
        timerIsOn: false,
        passage: "my grand father \n hi"
      }
    },
    methods: {
      count: function() {
        if(this.timer_sec == 0 && this.timer_min > 0) {
            this.timer_sec = 59;
            this.timer_min--;
        }
        else if(this.timer_sec > 0 && this.timer_min >= 0) {
            this.timer_sec--;
        }
      },
      start: function() {
        this.timerIsOn = true;
        setInterval(()=>{this.count()}, 1000);
      }
    },
    mounted() {
      this.start()
    }
  }
</script>

<style lang="scss">
  #card {
    margin-top: 20px;
  }

  #passage {
    font-size: 20px;
    font-family: cursive
  }
</style>
