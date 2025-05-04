// HTMLファイルにinput要素を配置し、ファイルが選択された時の処理を記述する
<input type="file" id="csvFileInput" accept=".csv">

// JavaScriptでファイルが選択された時の処理
document.getElementById('csvFileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const csvData = event.target.result;
        processData(csvData); // CSVデータを処理する関数を呼び出す
    };

    reader.readAsText(file);
});

function processData(csvData) {
    const lines = csvData.split('\n');
    let totalHours = 0;

    lines.forEach(line => {
        const cells = line.split(',');
        const startTime = parseTime(cells[1]); // 開始時間の取得（parseTime関数は実装例）
        const endTime = parseTime(cells[2]);   // 終了時間の取得（parseTime関数は実装例）

        if (startTime && endTime) {
            const hoursWorked = calculateHours(startTime, endTime);
            totalHours += hoursWorked;
        }
    });

    const hourlyWage = 1000; // 仮の時給（適宜変更してください）
    const totalPay = totalHours * hourlyWage;

    console.log(`Total hours worked: ${totalHours}`);
    console.log(`Total pay: ${totalPay}`);
}

function parseTime(timeString) {
    if (!timeString) return null;

    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
}

function calculateHours(startTime, endTime) {
    const start = new Date(0, 0, 0, startTime.hours, startTime.minutes);
    const end = new Date(0, 0, 0, endTime.hours, endTime.minutes);

    let hoursWorked = (end - start) / 1000 / 60 / 60; // 時間を計算して返す
    return hoursWorked;
}


function processImage() {
    const file = document.getElementById('imageInput').files[0];
    if (!file) {
        alert("画像を選択してください。");
        return;
    }

    Tesseract.recognize(
        file,
        'jpn', // 日本語モード
        { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        console.log('認識結果:', text);

        // ★ここで「text」をCSVっぽく変換する
        // 仮に改行区切りとカンマ区切りだと仮定して処理する
        csvData = text.replace(/\t/g, ','); // タブ区切りならカンマに
        processCSV(); // 既存のCSV処理関数を呼び出す！
    }).catch(err => {
        console.error(err);
        alert("画像から文字を読み取れませんでした。");
    });
}
