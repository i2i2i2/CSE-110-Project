# Yellow Submarine

#### --- CSE 110 Project， Winter 2017


## Introduction

Yellow Submarine is an Android app that is built for anonymous chatting. Users are like submarine under water, remains anonymous most of the time. User joining chatroom or creating a chatroom is like submarine droping a sonar floater. User/Submarine can then be discovered and discover others nearby.

https://www.youtube.com/watch?v=IS-Es5uFN7M&t=1s


## Requirements

- Android Device running with a minimum API of 22.
- WiFi Connection.
- Device Screen Ratio: 16: 9.
- CPU >= Snapdragon 820 for smooth transition of UI.

## How To Install

### Build Your Own

1. Git clone project (https://github.com/i2i2i2/CSE-110-Project/)
2. Install Meteor.js v1.4.1.3 (https://www.meteor.com/install)
3. Install Node.js v4.6.2 (https://nodejs.org/en/download/)
4. Install Android-SDK, api 22 (http://ieng6.ucsd.edu/~cs110x/static/labs/lab3/index.html)
5. Go to "CSE-110-Project/submarine" folder, run `meteor npm install` to install all dependencies.
6. Go to "CSE-110-Project/deploy", run `npm install -g mup@0.11.3` to install deployment tool.
7. Modify urls in "CSE-110-Project/mup.json" and "CSE-110-Project/submarine/server/init.js" to use custom server. (http://meteortips.com/deployment-tutorial/digitalocean-part-1/)
8. `mup setup` to setup server environment, `mup deploy` to deploy project onto server. Now server should be up and running. Go to "<host>:<port>" in browser to get a preview.
9. Go to "CSE-110-Project/submarine", connect android phone to computer and run `meteor run android-device --mobile-server=<host>:<port>`
10. Make sure the app is successfully ran on tethered phone at least one, then `meteor build <build-output-directory> --server <host>:<port>` to produce android binary file. Created apk should have name  release-unsigned.apk
11. Go to <build-output-directory> and Sign the android binary.
`keytool -genkey -alias <your-app-name> -keyalg RSA -keysize 2048 -validity 10000`
`jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 release-unsigned.apk <your-app-name>`
 Change name from release-unsigned.apk to yellow-submarine.apk
12. Install the binary to phone by connecting phone to computer and run
`adb install yellow-submarine.apk`

### Use Pre-Built

1. Install Android-SDK, api 22 (http://ieng6.ucsd.edu/~cs110x/static/labs/lab3/index.html)
2. Git clone project (https://github.com/i2i2i2/CSE-110-Project/)
3. Go to "CSE-110-Project/bin/android" folder
4. Run `adb install yellow-submarine.apk` should display successful in terminal

## How To Run

By Simply Clicking on the App Icon on your phone.

## Test Account Credential

We don't have any. Since our app is based on location, without konwing the grading room, we cannot utilize much pre-seeded data in database.

You may always create new account in the system. The account would be brand new.

## Known Issues

1. Changing system time during chatting create devastating effect, please do not change system time during chatting.
2. Sometimes, the reactive content like profile picture will not load up. There is memory leak of event listener in one of the meteor package that we use. The memory leak of the package sometimes lead to broken reactivtiy. The broken reactivity would make page unresponsive to some database change. Refresh or reopen app solves the issue.
3. There are unimplemented UI components. Ex, button at chat room profile page, "if show in Calendar" but we have not implement the calendar. Button at user profile page, "If shows recommendation", not implemented either.
4. The app partially supports web. You may go to 104.236.147.136:3000 for fast preview. But Cordova functions like FCM notification and WifiWizard won't work on webpage. Also, we use url to keep info secret from user. The url hidden in cordova but shown in website would give out extra info that user should not know.

## Contributors

 * Chenxu Jiang, i2i2i2
 * Wanhui Qiao, fash97
 * Yuandong Zhang, philzhang01
 * Pengyu Chen, EasonChan236
 * Ruitian Lin, lrt98802
 * Zijin Fu, zif008
 * Tianyi Wang, secondkimi
 * Jiaqi Wu, QDQD
 * Shuyi Ni, ShuyiNi
 * Dingcheng Hu, dingchenghu
