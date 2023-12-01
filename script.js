// Inisialisasi variabel untuk setup permainan Puzzle Fifteen
var p = setup.puzzle_fifteen, // Variabel untuk konfigurasi permainan Puzzle Fifteen
  freeslot = [], // Array untuk menyimpan slot yang tersedia untuk permainan
  size = [], // Array untuk menyimpan ukuran permainan
  m = [], // Array untuk menyimpan matriks permainan
  o, // Variabel untuk objek permainan
  f = document.getElementById("fifteen"); // Variabel untuk mendapatkan elemen HTML dengan id "fifteen"

// Panggil fungsi untuk membuat slot-slot permainan
ceation_slots();

// Fungsi untuk membuat slot-slot permainan Puzzle Fifteen
function ceation_slots() {
  size = [p.size[0] / (p.grid[0] + 1), p.size[1] / (p.grid[1] + 1)]; // Menentukan ukuran setiap slot berdasarkan konfigurasi grid
  var c = p.emptySlot ? p.emptySlot : (p.grid[1] + 1) * (p.grid[0] + 1); // Menentukan jumlah total slot, termasuk slot kosong jika ada
  f.style.width = p.size[0] + "px"; // Mengatur lebar elemen permainan
  f.style.height = p.size[1] + "px"; // Mengatur tinggi elemen permainan
  f.style.position = "relative"; // Menetapkan posisi relatif untuk elemen permainan

  // Menyesuaikan ukuran permainan jika pilihan 'fill' diaktifkan, dan menambahkan event listener untuk resize
  if (p.fill) {
    fifteen_resize();
    window.addEventListener("resize", fifteen_resize, true);
  }

  o = 1; // Inisialisasi variabel counter untuk nomor slot
  for (var y = 0; y <= p.grid[1]; y++) {
    for (var x = 0; x <= p.grid[0]; x++) {
      if (o != c) {
        if (!m[y]) {
          m[y] = [];
        }
        m[y][x] = o;

        // Membuat elemen div untuk setiap slot permainan
        var e = document.createElement("div");
        e.id = "slot" + o;
        e.setAttribute("onclick", "move_slot(" + o + ")"); // Menambahkan event onclick untuk setiap slot
        e.className = "slot";

        // Menampilkan nomor pada slot jika pilihan 'number' diaktifkan
        if (p.number) {
          e.innerHTML = o;
        }

        // Menetapkan properti CSS untuk tampilan dan posisi slot
        e.style =
          "background-image:url(" +
          p.art.url +
          ");background-size:" +
          (p.art.ratio ? p.size[0] + "px auto" : "auto " + p.size[1] + "px") +
          ";background-position:-" +
          size[0] * x +
          "px -" +
          size[1] * y +
          "px ;width:" +
          size[0] +
          "px;height:" +
          size[1] +
          "px;top:" +
          size[1] * y +
          "px;left:" +
          size[0] * x +
          "px;position:absolute;" +
          (p.style ? p.style : "");

        // Menetapkan durasi transisi jika pilihan 'time' diaktifkan
        if (p.time) {
          e.style.transitionDuration = p.time + "s";
        }

        // Menambahkan elemen slot ke dalam elemen permainan
        f.appendChild(e);
        o++;
      } else {
        m[y][x] = 0;
        freeslot = [y, x]; // Menyimpan posisi slot kosong
        o++;
      }
    }
  }

  stir_slots(); // Memanggil fungsi untuk mengacak posisi slot
}

// Fungsi untuk mengacak posisi slot permainan
function stir_slots() {
  for (var y = 0; y < p.diff; y++) {
    var a = [];
    
    // Memilih apakah akan menggeser posisi secara horizontal atau vertical
    if (Math.random() * 2 > 1) {
      a = [freeslot[0] + (-1 + Math.round(Math.random() * 2)), freeslot[1]];
      if (a[0] < 0) {
        a[0] = a[0] + 2;
      } else if (a[0] > p.grid[1]) {
        a[0] = a[0] - 2;
      }
    } else {
      a = [freeslot[0], freeslot[1] + (-1 + Math.round(Math.random() * 2))];
      if (a[1] < 0) {
        a[1] = a[1] + 2;
      } else if (a[1] > p.grid[0]) {
        a[1] = a[1] - 2;
      }
    }

    // Menukar posisi antara slot kosong dan slot yang dipilih secara acak
    var s = [m[freeslot[0]][freeslot[1]], m[a[0]][a[1]]];
    m[freeslot[0]][freeslot[1]] = s[1];
    m[a[0]][a[1]] = s[0];
    freeslot = [a[0], a[1]];
  }

  // Memperbarui posisi visual setiap slot dalam elemen permainan
  for (var y = 0; y <= p.grid[1]; y++) {
    for (var x = 0; x <= p.grid[0]; x++) {
      if (m[y][x]) {
        var e = document.getElementById("slot" + m[y][x]);
        e.style.left = x * size[0] + "px";
        e.style.top = y * size[1] + "px";
      }
    }
  }
}

// Fungsi untuk memindahkan slot permainan ke posisi yang diinginkan
function move_slot(s) {
  var z = 0,
    e,
    a = [],
    k,
    j;

  // Fungsi untuk menggeser posisi slot secara visual
  function move(y, x, h, w) {
    j = m[y][x];
    e = document.getElementById("slot" + j);
    e.style.left = (x + w) * size[0] + "px";
    e.style.top = (y + h) * size[1] + "px";
    m[y][x] = k;
    k = j;
  }

  // Iterasi melalui matriks permainan untuk menemukan posisi slot yang akan dipindahkan
  for (var y = 0; y < p.grid[1] + 1; y++) {
    for (var x = 0; x < p.grid[0] + 1; x++) {
      if (m[y][x] == s) {
        a = [y, x];
        k = 0;

        // Menyesuaikan posisi slot berdasarkan posisi slot kosong
        if (freeslot[0] == a[0]) {
          if (freeslot[1] > a[1]) {
            for (z = 0; z < freeslot[1] - a[1]; z++) {
              move(a[0], a[1] + z, 0, +1);
            }
          } else if (freeslot[1] < a[1]) {
            for (z = 0; z < a[1] - freeslot[1]; z++) {
              move(a[0], a[1] - z, 0, -1);
            }
          }
          m[freeslot[0]][freeslot[1]] = k;
          freeslot = [a[0], a[1]];
          s = false;
          break;
        } else if (freeslot[1] == a[1]) {
          if (freeslot[0] > a[0]) {
            for (z = 0; z < freeslot[0] - a[0]; z++) {
              move(a[0] + z, a[1], +1, 0);
            }
          } else if (freeslot[0] < a[0]) {
            for (z = 0; z < a[0] - freeslot[0]; z++) {
              move(a[0] - z, a[1], -1, 0);
            }
          }
          m[freeslot[0]][freeslot[1]] = k;
          freeslot = [a[0], a[1]];
          s = false;
          break;
        }
      }
      if (!s) {
        break;
      }
    }
    if (!s) {
      break;
    }
  }

  // Memeriksa apakah urutan slot sudah benar setelah pemindahan
  check_slots();
}

// Fungsi untuk memeriksa urutan slot dan menampilkan pesan kemenangan jika benar
function check_slots() {
  var check = 1;

  // Iterasi melalui matriks permainan untuk memeriksa urutan slot
  for (var y = 0; y <= p.grid[1]; y++) {
    for (var x = 0; x <= p.grid[0]; x++) {
      if (m[y][x] == 0 || check == m[y][x]) {
        check++;
      } else {
        break;
      }
    }
  }

  // Menampilkan pesan kemenangan jika urutan slot benar
  if (check == o) {
    setTimeout(
      () => {
        alert("win");
      },
      p.time ? p.time * 1000 : 0
    );
  } // <-- Script untuk menampilkan pesan 'win' di akhir permainan
}

// Fungsi untuk menyesuaikan skala permainan Puzzle Fifteen saat ukuran layar berubah
function fifteen_resize() {
  var rect = f.parentNode.getBoundingClientRect();
  if (p.size[0] / p.size[1] < rect.width / rect.height) {
    f.style.transform = "scale(" + rect.height / p.size[1] + ")";
  } else {
    f.style.transform = "scale(" + rect.width / p.size[0] + ")";
  }
}

// Mendengarkan peristiwa tombol keyboard jika pilihan 'keyBoard' diaktifkan
if (p.keyBoard) {
  document.addEventListener("keydown", function (e) {
    e = e.keyCode;
    if (e == 37) {
      move_slot(m[freeslot[0]][freeslot[1] + 1]);
    } else if (e == 39) {
      move_slot(m[freeslot[0]][freeslot[1] - 1]);
    } else if (e == 38) {
      move_slot(m[freeslot[0] + 1][freeslot[1]]);
    } else if (e == 40) {
      move_slot(m[freeslot[0] - 1][freeslot[1]]);
    }
  });
}

// Mendengarkan peristiwa koneksi gamepad jika pilihan 'gamePad' diaktifkan
let gamepad, gamepadPress;
if (p.gamePad) {
  window.addEventListener("gamepadconnected", function (e) {
    const update = () => {
      for (gamepad of navigator.getGamepads()) {
        if (!gamepad) continue;
        const statenow = gamepad.buttons.some((btn) => btn.pressed);
        if (gamepadPress !== statenow) {
          gamepadPress = statenow;
          if (gamepad.buttons[12].pressed && m[freeslot[0] + 1]) {
            move_slot(m[freeslot[0] + 1][freeslot[1]]);
          } else if (gamepad.buttons[14].pressed && m[freeslot[0]]) {
            move_slot(m[freeslot[0]][freeslot[1] + 1]);
          } else if (gamepad.buttons[15].pressed && m[freeslot[0]]) {
            move_slot(m[freeslot[0]][freeslot[1] - 1]);
          } else if (gamepad.buttons[13].pressed && m[freeslot[0] - 1]) {
            move_slot(m[freeslot[0] - 1][freeslot[1]]);
          }
        }
      }
      requestAnimationFrame(update);
    };
    update();
  });
}