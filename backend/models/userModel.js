const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
         type: String,
        required: true,
    },
    email: {
         type: String,
        required: true,
        unique: true,
    },
    password: {
         type: String,
        required: true,
    },
    pic: {
         type: String,
        required: true,
        default : "https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png",
    },
    
},
 {
    timestamps: true,
 }
);

userSchema.methods.matchPassword = async function (enteredPassword)  {
    
    // const hashedenteredPassword = await bcrypt.hash(enteredPassword, 8);
    // const hashedPassword = await bcrypt.hash(this.password, 8);
    console.log(enteredPassword);
    console.log(this.password);
    // return enteredPassword===this.password;
    return await bcrypt.compare(enteredPassword, this.password);


}

userSchema.pre('save', async function (next){
    if(!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, 8);
})

const User = mongoose.model("User", userSchema);
module.exports = User;