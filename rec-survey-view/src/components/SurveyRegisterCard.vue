<template>
  <v-card
    id="register-card"
  >
    <v-form
      ref="form"
      lazy-validation
      id="form"
    >
      <v-layout>
        <v-flex xs12 sd8>
          <v-text-field
            v-model="surveyName"
            label="Survey Name"
            :rules="rules"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs8 sd8>
          <v-select
            :items="pictureNames"
            label="Select Picture"
            v-model="pictureName"
            :rules="rules"
          ></v-select>
        </v-flex>
        <v-flex xs8 sd8>
          <v-select
            :items="passageNames"
            label="Select Passage"
            v-model="passageName"
            :rules="rules"
          ></v-select>
        </v-flex>
      </v-layout>
    <v-btn
      depressed
      color="primary"
      v-on:click="register()"
    >Register</v-btn>
        <span
          v-if="showDuplicatedErr"
          style="color:red"
            >Error: Duplicated survey name, please use different name</span>
    </v-form>
  </v-card>
</template>

<script>
    import config from "../config";
    
    export default {
        data() {
            return {
                rules:[
                    v=> !!v || 'this field is required'
                ],
                pictureNames: [],
                pictures: [],
                pictureName: "",
                surveyName: "",
                passageName: "",
                passageNames: [],
                passages: [],
                showDuplicatedErr: false
            }
        },
        methods: {
            register() {
                let survey = {
                    picture_id: this.getSelectedPictureId(),
                    passage_id: this.getSelectedPassageId(),
                    name:       this.surveyName
                };
                let url = config.API_URL + "/survey";
                
                if(!survey.picture_id || !survey.passage_id || survey.name === "") {
                    return; //TODO bad ux
                }

                this.$axios.post(url, survey).then(()=>{
                    this.$emit('survey-registered');
                }).catch((err)=>{
                    this.showDuplicatedErr = true;
                    setTimeout(()=>{
                        this.showDuplicatedErr = false;
                    }, 3000);
                });
            },
            getSelectedPassageId() {
                let passage_id;
                for(let passage of this.passages) {
                    if(passage.name === this.passageName) {
                        passage_id = passage._id;
                        break;
                    }
                }
                return passage_id;
            },
            getSelectedPictureId() {
                let picture_id;
                for(let picture of this.pictures) {
                    if(picture.name === this.pictureName) {
                        picture_id = picture._id;
                        break;
                    }
                }
                return picture_id;
            },
            getPictureList() {
                let url = config.API_URL + "/picture-list";
                
                return new Promise((resolve, reject)=>{
                    this.$axios.get(url).then(({data})=>{
                        resolve(data);
                    }).catch((err)=>{
                    });
                });
            },
            getPassageList() {
                let url = config.API_URL + "/passage-list";
                
                return new Promise((resolve, reject)=>{
                    this.$axios.get(url).then(({data})=>{
                        resolve(data);
                    }).catch((err)=>{
                        reject(err);
                    });
                });
            },
            async handleFillPictureNames() {
                this.pictures = await this.getPictureList();
                for(let picture of this.pictures) {
                    this.pictureNames.push(picture.name);
                }
            },
            async handleFillPassageNames() {
                this.passages = await this.getPassageList();
                for(let passage of this.passages) {
                    this.passageNames.push(passage.name);
                }
            }
        },
        mounted() {
        },
        beforeMount() {
            this.handleFillPictureNames();
            this.handleFillPassageNames();
        }
    }
</script>

<style>
    #register-card{
        margin-bottom: 12px;
    }
    #form {
        padding: 10px;
    }
    .flex {
        padding: 8px;
    }
</style>
