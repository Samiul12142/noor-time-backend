const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Firebase Setup (Secret Keys from Environment Variables)
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.gs-tour-bd,
    clientEmail: process.env.firebase-adminsdk-fbsvc@gs-tour-bd.iam.gserviceaccount.com,
    privateKey: process.env.-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD12FgnedgvyxVk\nW7OxQmkes7lDfjrOe99XAEHw16hKTyWkvf1EHeL3QaKa27FAUrAizakph2x24bm/\nNn48w0vrsfsZOjWJ8wSc963D9sT51ZRp+AjCzSUQ78aMnrXw8yxdWNOVlPICiv36\n5BnD1saGX5F2XA+lJkI6QfpoeoQ917eB5bunC99vnSirJbBGOf3VFabGRsXERDaf\nGcwEatpoSv60cPdQRY5ZT9XXgSyTUhlRGi5NiEBi1jq80MgiBFoZPncY7/UuOItK\nlATSoo4H879nAdKOz1wQJqCjovVURkuL9WDlojURWWhi4MfoQPi51+eCUby1zZav\nIHxeteczAgMBAAECggEAL0wqlZmu+m7vVCoCVbGJqNL56x6/cJdLXiEaDpxm77jv\nbJTyw2aekmRJxNJMdSwTX/bCO0+nEe4Wfs+clNMb6aIJxY4526rp8csC3sc8mTY6\ngfKquNOf9HS09bvZFByspd7fghEwSEX2XA0DWfaZpiN/yE4o4mSMbEniQ7SCeaUE\nzB4rrmaXOPMhsp4EnSZYPFhAB7/SAmtcacrD1aX2sPgifBztA6JT1xN7J2gAgZsq\n0HFO6aiSFrpufu5pGwCYu1s1dISe9CfWmYk1ruyE4RXP+15lXSuEjQV+zA3DvrRx\nIwShKtCN2tJlUlLweGS4Qb/9AR4L2ngvAg1nkQaswQKBgQD8uj1inIHuiuZv252D\nQ8TOK+ivmXUbxYQZtE7HG7AijojlZjM2CndzUXhjxi13JImr5nDYxyOMn0cwlrXf\n/4fbRwevwOEdCZad7mckXGxTIuAbHmLP7uE6qQYSgmoT+FhQZMFNLWpL+LNaE2X1\nLix9dlWynOfyKTJzPSX8SrbCwQKBgQD5B0pOC5Q2UkFp91Krs6EV0gmJukdCGIyL\nd9HB6I+WCTtfyP1MT8cHvneobFNGIq5O6HNw0Fw9nDhEV5uKX6rnsOgn/DuQXRn9\nAbSiKsd8t68LnbJGF8FYlnGz7zPejswBhOj4OryVAChAOQnwO0yosall20U+uiBU\n4+ea8P+K8wKBgBZzfQyLlsdYM4xwWBfXJ16ha/Rdj5e9/jRCXlU10nnfa63lXFtK\npr3p2OYULunMpyZMPG4lkrTlWW+pk9KoYqtKLhag7d6kgWraSPNj+oOQL5R5KJIM\nSJnrdgyi5UWM5FuP99QhWrYRC+3Ol1omlfE3V/mcEsbifgbawcsd4AqBAoGBAKED\na7HGns/4oz7moNdPz4mSQoSAou5DfSv4DvG3co9p7K/j/pLGykNhjXCiib1BUz7F\n4U5CCkHzrhXSJ0lyzcf8hD7GQaT37YO/BJIN4unqwg1aqxfS6DplG6NhuEHgRlt9\nGjzVjXUxotTTjG99h/VS2dp3ye/i3GDG8sslo7StAoGBANdMyLylja9ZzASylI35\n8mDYHe7sec9/HSNs42k5Tk92MnXK4r5BdrA8qM+WAaQUlz0MH7QLvOHBcZ3sg9of\nhnFv9jnE6NzshGWhmWaTYif9ExSth4De/4lo5FC6UNuTL/j/iXQnRLRkLe1EFQUw\nivIMEoh00h2gd0Lgag4hZa+D\n-----END PRIVATE KEY-----\n.replace(/\\n/g, '\n')
  }),
  databaseURL: https://console.firebase.google.com/u/5/project/gs-tour-bd/database/gs-tour-bd-default-rtdb/data/~2F?fb_utm_campaign=Cloud-SS-DR-Firebase-FY26-global-gsem-1713590&fb_utm_content=text-ad&fb_utm_medium=cpc&fb_utm_source=google&fb_utm_term=KW_firebase&fb_gclid=CjwKCAjwl97RBhBWEiwAa9rbXbHOXB1o-LS3MmNmLTeMCp1TBSzDSOrVUGfE38RMjpAVkqXZ1rfXrBoCA7wQAvD_BwE
});

const db = admin.database();
const app = express();
app.use(cors());
app.use(express.json());

// ইউজারের সেটিংস ডাটাবেসে সেভ করা
app.post('/save-settings', async (req, res) => {
    const { token, settings } = req.body;
    if(token) {
        await db.ref('users/' + token).set(settings);
        console.log("Settings saved for a user.");
        res.send({ message: "Saved Successfully" });
    } else {
        res.status(400).send("No token provided");
    }
});

// প্রতি মিনিটে হিট আসবে নোটিফিকেশন চেক করার জন্য
app.get('/check-alarms', async (req, res) => {
    // বাংলাদেশ সময় বের করা
    const bdTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const currentHM = `${bdTime.getHours().toString().padStart(2, '0')}:${bdTime.getMinutes().toString().padStart(2, '0')}`;

    const snapshot = await db.ref('users').once('value');
    const users = snapshot.val();
    
    if(users) {
        const prayerNamesBn = { Fajr: "ফজর", Dhuhr: "যোহর", Asr: "আসর", Maghrib: "মাগরিব", Isha: "এশা" };
        
        Object.keys(users).forEach(token => {
            const prayers = users[token];
            Object.keys(prayers).forEach(prayer => {
                if (prayers[prayer].alarm && prayers[prayer].time === currentHM) {
                    // ফায়ারবেস দিয়ে নোটিফিকেশন পাঠানো
                    admin.messaging().send({
                        notification: { title: `নামাজের সময়: ${prayerNamesBn[prayer]}`, body: `এখন ${prayerNamesBn[prayer]} নামাজের সময় হয়েছে।` },
                        token: token
                    }).catch(err => console.log("Token error (maybe user uninstalled app):", err));
                }
            });
        });
    }
    res.send("Successfully Checked at " + currentHM);
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
