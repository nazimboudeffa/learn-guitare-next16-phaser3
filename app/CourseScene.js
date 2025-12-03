export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    console.log('MenuScene create: settings.data', this.scene.settings.data);
    this.add.text(450, 180, 'Bienvenue dans ce cours!', { fontSize: '38px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(450, 240, 'Clique sur "Let\'s Go" pour commencer le cours.', { fontSize: '22px', color: '#ffd700' }).setOrigin(0.5);
    const startBtn = this.add.rectangle(450, 320, 220, 60, 0x00bfff, 0.8).setOrigin(0.5).setInteractive();
    this.add.text(450, 320, "Let's Go", { fontSize: '28px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
    startBtn.on('pointerdown', () => {
      console.log('MenuScene: starting CourseScene');
      console.log('MenuScene: course before start', this.scene.settings.data?.course);
      const data = {
        ...this.scene.settings.data,
        course: this.scene.settings.data?.course,
        courseKey: this.scene.settings.data?.courseKey
      };
      console.log('MenuScene: passing data to CourseScene', data);
      this.scene.start('CourseScene', data);
    });
  }
}
// src/scene.js
/**
 * Simple mapping frequency -> closest open string (E A D G B e)
 * We'll use standard tuning frequencies for strings:
 * E2(82.41), A2(110.00), D3(146.83), G3(196.00), B3(246.94), E4(329.63)
 */

const STRING_NOTES = [
  { name: "E", freq: 82.41 },
  { name: "A", freq: 110 },
  { name: "D", freq: 146.83 },
  { name: "G", freq: 196 },
  { name: "B", freq: 246.94 },
  { name: "e", freq: 329.63 }
];

export function freqToStringName(freq) {
  if (!freq || freq <= 0) return null;
  let closest = STRING_NOTES[0];
  let minDiff = Math.abs(freq - closest.freq);
  for (let s of STRING_NOTES) {
    const d = Math.abs(freq - s.freq);
    if (d < minDiff) {
      minDiff = d;
      closest = s;
    }
  }
  return closest.name;
}

export default class CourseScene extends Phaser.Scene {
    destroyed = false;
  constructor() {
    super({ key: "CourseScene" });
    console.log('CourseScene constructor called');
      // Ajoute le listener d'événement pitch
      this._pitchListener = (e) => {
        if (e && e.detail) {
          this.onPitch(e.detail);
        }
      };
  }

  init(data) {
    console.log('CourseScene init data:', data);
    this.courseKey = data?.courseKey || 'course-1-1';
    this.course = data?.course || {};
    if (this.course && Array.isArray(this.course.notes)) {
      console.log('CourseScene init notes:', this.course.notes);
    } else {
      console.warn('CourseScene init: no notes found in course', this.course);
    }
    // Ajoute le listener à l'init
    window.addEventListener('pitch', this._pitchListener);
  }

  preload() {
    // Les données sont maintenant reçues via init(data)
  }

  create() {
    // Index for note spawning
    this.courseIndex = 0;
    // (Bouton arrêter retiré pour debug)

    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x2d7c45, 0x00bfff, 0x32cd32, 0x222222, 1);
    bg.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);
    bg.setDepth(-1);

    // Feedback écoute (affichera la note écoutée)
    this.listeningFeedback = this.add.text(450, 30, '🎤 Écoute activée', {
      fontSize: '22px', color: '#00ff99', fontStyle: 'bold', backgroundColor: '#222', padding: { left: 12, right: 12, top: 4, bottom: 4 }, shadow: { offsetX: 0, offsetY: 2, color: '#222', blur: 6, fill: true }
    }).setOrigin(0.5);
    this.lastHeardNote = null;

    // Layout
    this.targetY = [420, 360, 300, 240, 180, 120];
    this.noteTypes = [
      { name: "E", color: 0x00bfff },
      { name: "A", color: 0x32cd32 },
      { name: "D", color: 0xffd700 },
      { name: "G", color: 0xff69b4 },
      { name: "B", color: 0xff8c00 },
      { name: "e", color: 0xffffff }
    ];

    // draw lines + labels with animated highlight
    for (let i = 0; i < 6; i++) {
      const line = this.add.line(0, 0, 0, this.targetY[i], 900, this.targetY[i], 0xffffff, 0.1).setLineWidth(6);
      line.setAlpha(0.5);
      this.tweens.add({ targets: line, alpha: 1, duration: 1200, yoyo: true, repeat: -1, delay: i * 120 });
      this.add.text(60, this.targetY[i], this.noteTypes[i].name, { fontSize: "24px", color: Phaser.Display.Color.IntegerToColor(this.noteTypes[i].color).rgba, fontStyle: "bold", shadow: { offsetX: 0, offsetY: 2, color: '#222', blur: 4, fill: true } }).setOrigin(0.5);
    }

    // target area rectangle (where player should play) - rounded, glowing
    const targetRect = this.add.rectangle(150, 270, 48, 360, 0xffffff, 0.1).setOrigin(0.5);
    targetRect.setStrokeStyle(4, 0x00bfff, 0.8);
    this.tweens.add({ targets: targetRect, alpha: 0.25, duration: 800, yoyo: true, repeat: -1 });

    // notes group
    this.notesGroup = this.add.group();

    // spawn control
    this.exerciseStartTime = null;

    this.currentTargetNote = null;

    // Use exercise data from config
    this.courseNotes = Array.isArray(this.course.notes) ? this.course.notes : [];

    // Stats tracking
    this.stats = {
      total: this.courseNotes.length,
      success: 0,
      fail: 0
    };
    this.shownStatsScene = false;
    
    this.feedback = this.add.text(400, 550, "", { fontSize: "18px", color: "#ffff00" }).setOrigin(0.5);

    this.isListening = true;

    // L'audio doit être activé par un geste utilisateur (bouton "Écouter" sur la page)
  }

  // createOverlay removed: mic activation is now handled in MenuScene

  async startListening() {
    // Microphone is already activated in MenuScene
    // Optionally, subscribe to pitch updates here if needed
  }

  onPitch({ pitch, clarity }) {
    // Si plus de notes à jouer, on ignore les pitch events
    if (
      this.notesGroup &&
      typeof this.notesGroup.getLength === 'function'
    ) {
      // Plus de notes à jouer, on ignore
      return;
    }

    if (this.destroyed || !this.notesGroup || !this.listeningFeedback) {
      console.warn('onPitch ignoré (destroyed, notesGroup ou listeningFeedback manquant)');
      return;
    }

    const setListeningText = (text) => {
      if (this.listeningFeedback) {
        try {
          this.listeningFeedback.setText(text);
        } catch (e) {
          console.warn('Erreur setText sur listeningFeedback (Phaser détruit ?)', e);
        }
      }
    };

    const handleFail = (msg) => {
      this.stats.fail++;
      if (this.feedback && typeof this.feedback.setText === 'function') {
        try {
          this.feedback.setText(msg);
        } catch (e) {
          console.warn('Erreur setText sur feedback (Phaser détruit ?)', e);
        }
      }
    };

    console.log('onPitch called:', pitch, clarity);
    if (!pitch || clarity < 0.7) {
      setListeningText('🎤 Écoute activée : -');
      return;
    }

    this.played = freqToStringName(pitch);
    console.log('Note jouée détectée:', this.played);
    if (!this.played) {
      setListeningText('🎤 Écoute activée : -');
      return;
    }

    // Affiche la note écoutée
    this.lastHeardNote = this.played;
    setListeningText(`🎤 Écoute activée : ${this.played}`);


    if (this.played) {
      // Check for notes in target zone
      let children = [];
      children = this.notesGroup.getChildren();
      if (!Array.isArray(children)) {
        handleFail(`Erreur interne : notesGroup.getChildren() n'est pas un tableau`);
        return;
      }
      const notesInZone = children.filter(container => container.x > 130 && container.x < 170 && !container.hit);

      if (notesInZone.length === 0) {
        handleFail(`Tu as joué ${this.played} — aucune note dans la zone cible`);
        return;
      }

      // Try to match this.played note with any note in zone
      const matchedNote = notesInZone.find(container => container.noteName === this.played);
      if (matchedNote) {
        matchedNote.hit = true;
        if (matchedNote.circle) {
          matchedNote.circle.setFillStyle?.(0x00ff00); // green for hit
          // Animation pop
          this.tweens.add({
            targets: matchedNote.circle,
            scale: 1.5,
            duration: 120,
            yoyo: true,
            ease: 'Quad.easeInOut',
          });
        }
        this.stats.success++;
        this.feedback?.setText?.(`Bravo ! Note ${this.played} réussie (clarité ${Math.round(clarity * 100)}%)`);
        this.time.delayedCall(400, () => matchedNote.destroy());
      } else {
        handleFail(`Note jouée (${this.played}) mais ce n'est pas la bonne corde !`);
      }
    } else {
      handleFail(`Tu as joué ${this.played} — mais il n'y a pas de note à jouer !`);
    }
  }

  update(time, delta) {
    console.log('CourseScene update called', time, delta);
    this.moveAndHandleNotes(delta);

    // Exercise timing
    if (!this.exerciseStartTime) {
      this.exerciseStartTime = time;
    }
    const elapsed = (time - this.exerciseStartTime) / 1000;

    // Debug: log courseNotes and spawn condition
    if (this.courseNotes && this.courseNotes.length > 0) {
      console.log('update: courseNotes length', this.courseNotes.length, 'courseIndex', this.courseIndex, 'elapsed', elapsed);
    } else {
      console.warn('update: courseNotes is empty or undefined', this.courseNotes);
    }

    // Spawn notes according to exercise sequence
    while (
      this.courseIndex < this.courseNotes.length &&
      elapsed >= this.courseNotes[this.courseIndex].time
    ) {
      const noteObj = this.courseNotes[this.courseIndex];
      console.log('update: spawning note', noteObj);
      this.spawnNote(noteObj.string, noteObj.fret, noteObj.length ?? 1);
      this.courseIndex++;
    }

    // Show stats scene only if still in CourseScene
    if (
      this.scene.key === 'CourseScene' &&
      this.courseIndex >= this.courseNotes.length &&
      this.notesGroup.getLength() === 0 &&
      !this.shownStatsScene
    ) {
      this.shownStatsScene = true;
      // Ajoute un délai avant de passer à la scène de stats
      this.time.delayedCall(1000, () => {
        if (this.scene.key === 'CourseScene') this.showStatsScene();
      });
    }
  }

  moveAndHandleNotes(delta) {
    // move notes left and check if in target zone
    for (const container of this.notesGroup.getChildren()) {
      let speed = 0.12; // vitesse réduite pour debug
      if (container.length && container.length > 1.2) {
        speed *= 0.5;  // les notes longues vont 2x moins vite
      }
      container.x -= delta * speed;
      console.log('Moving note', container.noteName, 'to x=', container.x);
      container.isInTargetZone = container.x > 130 && container.x < 170;
      // If note leaves the screen and was not hit, count as missed ONCE
      if (container.x < -40) {
        if (!container.hit && !container.missed) {
          container.missed = true;
          this.stats.fail++;
        }
        console.log('Destroying note', container.noteName);
        container.destroy();
      }
    }
  }

  showStatsScene() {
    // Calculate accuracy
    const totalAttempts = this.stats.success + this.stats.fail;
    const accuracy = totalAttempts > 0 ? Math.round((this.stats.success / totalAttempts) * 100) : 0;
    this.scene.start('StatsScene', {
      stats: {
        total: this.stats.total,
        success: this.stats.success,
        fail: this.stats.fail,
        accuracy
      },
      exercise: {
        title: this.course.title,
        description: this.course.description
      }
    });
  }

  spawnNote(noteName, fret = null, length = 1) {
    const idx = this.noteTypes.findIndex(n => n.name === noteName);
    const noteType = this.noteTypes[idx];
    // ...existing code...

    // Couleur du doigt
    let color = 0x888888; // défaut gris
    if (typeof fret === 'number') {
      if (fret === 1) color = 0xffeb3b;
      else if (fret === 2) color = 0x9c27b0;
      else if (fret === 3) color = 0x2196f3;
      else if (fret >= 4) color = 0xf44336;
    }

    // Gestion si noteName est un objet
    if (typeof noteName === 'object' && noteName !== null) {
      fret = noteName.fret ?? fret;
      length = noteName.length ?? length;
      noteName = noteName.string;
    }

    // Container pour note
    const container = this.add.container(900, this.targetY[idx]);
    console.log('Note container created at x=900, y=' + this.targetY[idx]);

    // -------------------------------
    // Queue de la note
    // -------------------------------
    const baseHeight = 36;
    const baseWidth = 20; // tête
    const queueWidth = baseWidth * length; // queue proportionnelle à length

    // Queue : rectangle fin
    const queue = this.add.rectangle(queueWidth / 2, 0, queueWidth, baseHeight / 3, color)
      .setOrigin(0.5, 0.5)
      .setAlpha(0.6); // légèrement transparent

    // Tête de la note : cercle
    const head = this.add.circle(0, 0, baseHeight / 2, color)
      .setStrokeStyle(2, 0xffffff);

    container.add([queue, head]);

    // -------------------------------
    // Texte de frette au-dessus
    // -------------------------------
    if (typeof fret === 'number') {
      const fretText = this.add.text(0, 0, fret.toString(), {
        fontSize: '18px',
        color: '#fff',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      container.add(fretText);
    }

    // -------------------------------
    // Données utiles
    // -------------------------------
    container.noteName = noteType.name;
    container.fret = fret;
    container.noteLength = length;
    container.hit = false;
    container.head = head;
    container.queue = queue;

    this.notesGroup.add(container);
    this.currentTargetNote = noteType.name;
  }

  // Nettoyage du listener quand la scène est détruite
  shutdown() {
    window.removeEventListener('pitch', this._pitchListener);
  }

  destroy() {
    this.destroyed = true;
    window.removeEventListener('pitch', this._pitchListener);
    super.destroy();
    if (this.destroyed) return;
  }
}