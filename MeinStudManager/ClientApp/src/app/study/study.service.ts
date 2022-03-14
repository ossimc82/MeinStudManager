import { Injectable, OnInit } from '@angular/core';
import { Method } from './method.model';

@Injectable({
  providedIn: 'root'
})
export class StudyService  {

  private methods: Method[] =  [
    new Method(
      "Pomodoro",
      `Die Pomodoro Technik ist eine sehr beliebte Lern- und Zeitmanagement-Technik.
      Die Lernzeit wird hierbei in kleine Abschnitte unterteilt, meist sind das 25 Minuten Lernzeit an die sich eine 5 Minuten Pause anschließt.
      Diese, meist 30 Minuten lange, Zeiträume werden Pomodori genannt.
       Nach 4 bis 5 Pomodori-Durchläufen  macht man eine längere Pause, von bis zu 20 Minuten.
      In einem Pomodori solltest du am besten wie folgt vorgehen:
      - Überlege dir für einen Durchlauf genau eine Aufgabe und notiere dir, was du dafür machen musst.
      Dann starte den 25 Minuten Lernzeitraum und arbeite den von dir überlegten Plan für die Aufgabe ab.
       Wenn die Zeit abgelaufen ist, hake ab, was du geschafft hast und gönne dir deine wohlverdiente Pause.
      Mit dieser Technik arbeitet man disziplinierter und damit effektiver. Man lernt meist schneller,
      da man die Zeit besser aufteilt und mit den Pausen und der strukturierten Arbeit, vermeidet man gleichzeitig auch,
      sich zu überarbeiten. Probier es doch gleich mal aus!
      `,
     [
       `https://www.studysmarter.de/magazine/pomodoro-technik-produktivitaet-im-studium/ Stand: 8.3.2022`,
     ` https://karrierebibel.de/pomodoro-technik/ Stand: 8.3.2022`
     ]
    ),
    new Method(
      "First-Brick Methode",
      `Das aufteilen einer Aufgabe in kleine Unteraufgaben ist das Herzstück dieser Methode.
      Und zwar teilt man die Aufgaben so lange, bis man bei dem kleinen, überschaubaren und ohne Probleme zu erledigenden Aufgaben ist.
      Man arbeitet somit rekursiv.Das Ziel ist es, das man sich nach jeder Aufgabe die man erledigt hat, Lust auf mehr bekommt.
      Das kommt durch die Freude am Überwinden kleinerer Hindernisse und zum Schluss der Hauptaufgabe,
      die zuerst unbezwingbar wirke. Auch kommt dazu ein kleiner psychologischer Trick ins Spiel.
      Gehen wir davon aus du musst Lernstoff über 100 Seiten in deinen Kopf bekommen,
      hast aber nur noch einen Monat Zeit. Das wirkt erstmal viel und das ist ernüchternd.
      Aber sagen wir, du lernst jeden Tag nur 5 Seiten und gehst diese einfach ein paar mal durch.
      Diese Aufgabe wirkt angenehmer und schaffbar in nicht mal einer Stunde.
      Und wenn du das jeden Tag machst, bist du in 20 Tagen durch und du hast sogar noch 10 Tage um dich weiter vorzubereiten.
      Das entspannt dein Gehirn, denn es weiß, es ist früher fertig und 5 Seiten sind locker zu schaffen.
      und wenn du an einem Tag mehr als 5 Seiten machst, dann fühlst du dich noch fleißiger und bist beruhigt,
      da du einen noch größeren Puffer hast.
      Das schöne ist, diese Methode ist vielseitig und auf viele Aspekte des Studiums oder anderer Lebensbereiche anzuwenden.
      Und wenn man sich die Aufgaben schön gliedert, kann man sie perfekt mit der Pomodoro-Technik kombinieren!
      `,
     [
       `https://www.studienscheiss.de/first-brick-methode/ Stand: 8.3.2022`,
     ` https://schreibscheune.de/die-first-brick-methode-endlich-anfangen-und-durchhalten/ Stand: 8.3.2022`
     ]
    ),
    new Method(
      "Alpen-Methode",
      `Keine Sorge, mit dieser Methode fühlt sich das Lernen nicht mehr so an, als hätte man einen riesigen Berg arbeit zu bewältigen, auch wenn der Name erstmal anderes verspricht. ‘ALPEN’ steht nämlich für: Aufgaben aufschreiben, Länge einschätzen, Pufferzeit einplanen, Entscheidungen treffen und Nachkontrollieren. Mit dieser Methode soll man sich besser selbst managen können und damit strukturierter arbeiten.

      Bei der Alpen-Methode erstellt man sich einen Tagesplan, und schreibt Aufgaben, die man erledigen möchte auf, am besten in einer To-Do Liste. Auch hier sind kleinere und übersichtliche Aufgaben besser, da man so entspannter an die Aufgaben herangehen kann und nicht sich schon im vorhinein den Kopf zerbricht.
      Danach notiert man sich zu jeder Aufgabe einen Schätzwert der Zeit. Damit hat man einen Überblick, wie viel Zeit man schon verplant hat.
      Und dann schau noch einmal über deine Zeit, denn du solltest dir einen Puffer freihalten. Dafür gibt es einen ungefähren Richtwert, und zwar solltest du nur 60 % deiner Arbeitszeit verplanen und dir 40% deiner effektiven Arbeitszeit als Puffer einplanen, denn man weiß nie, ob nicht noch was dazwischen kommt oder man sich beim Zeitaufwand verschätzt hat.
      Falls du zu viel geplant hast, musst du die Entscheidung treffen, welche Aufgaben du verschieben kannst und welche du unbedingt erledigen musst. Und dann kann es losgehen.
      Am besten plant man seinen Tag am Abend davor oder gleich am Morgen. Wichtig ist, am Ende des Tages noch einmal zu reflektieren und zu schauen, ob man alles was man sich vorgenommen hat, geschafft hat. Und wenn dem so ist, dann gönn dir einen schönen, verdienten Feierabend und genieße das Gefühl, das du heute alles was du dir vorgenommen hast, geschafft hast!
      `,
      [
        `https://karrierebibel.de/alpen-methode/ Stand: 8.3.2022`,
       `https://www.ionos.de/startupguide/produktivitaet/alpen-methode/ Stand: 8.3.2022`
      ]
    ),
    new Method(
      "Leitner-Algorithmus",
      `Keine Sorge, dieser Algorithmus hat nichts mit Mathematik zutun. Einige kennen diese Methode vielleicht schon und wenden diese an, des es geht um Lernkarteien. Viele sind überzeugt von dieser Methode, da du mit dieser gleich zweifach lernst. Erst durch das ordentliche aufschreiben des Lernstoffes und zum anderen durch das üben mit den Karteien.
      Zum richtigen Lernen mit Karteikarten brauchst du die Karten selbst und etwas, wie ein Karteikasten.

      Zuerst musst du den Stoff auf Karten bringen. Dafür eignet sich das Frage - Antwort Prinzip. Auf einer Seite schreibst du eine Frage, welche du von einem Fragekatalog deines Professors schon haben könntest. Wichtig ist es hier auch sich Fragen aus älteren Klausuren anzuschauen und mit aufzuschreiben. Auf die Rückseite kommt die richtige Antwort. Ein weiterer Punkt ist, sich den Stoff oder die Frage in Signalfarben aufzuschreiben, denn sowas merkt sich das Gehirn gerne.
      So kann es sein, das dir in der Klausur ein Begriff nicht einfällt, aber du weißt es stand auf einer grünen Karte mit blauer Schrift und schon weißt du den Begriff wieder.
      Zum lernen empfiehlt sich einen Karteikasten zu untergliedern. Zuerst sind alle Karten im ersten Fach, und du beantwortest alle Fragen im vordersten Kasten täglich. Wenn du eine Karte beantworten kannst, rutscht sie ins zweite Fach, welches du alle 2 Tage mit beantwortest. So steigerst du den Abfragezeitraum immer weiter, bis sie ganz hinten gelandet sind, dann hast du sie verinnerlicht! Sollte dir einmal die Antwort entfallen, dann rückt die Karte wieder eins nach vorne.
      Auch diese Methode kann man mit anderen Lernmethoden kombinieren, indem man sich am Tag 20 Minuten nimmt um die Karten zu lernen oder einen Pomodori-Intervall mit Fragen füllt!
      `,
      [
        `https://magazin.sofatutor.com/schueler/besser-lernen-mit-karteikarten/`,
        `https://magazin.sofatutor.com/schueler/die-4-besten-lernmethoden-fuer-die-schule/#Lernmethode%208`
      ]
    ),
    new Method(
      'Weitere Tipps',
      "1. Lerne in kurzen Intervallen" +
      '\n' + "2. Lerne kreativer und spielerisch" +
      '\n' + "3. Gehe vor dem Schlafengehen wichtige Themen noch einmal durch"+
      '\n' + "4. Ausreichend Schlaf ist hilfreich beim konzentrieren" +
      '\n' + "5. Konzentrier dich auf eine Sache, nicht auf mehrere"+
      '\n' +  "6. Wiederhole den Stoff"+
      '\n' + "7. Versuch Eselsbrücken zu bilden"+
      '\n' + "8. Lerne in einer aufgeräumten und ruhigen Umgebung"
      ,
      [
        `https://www.geo.de/geolino/wissen/7502-rtkl-lerntipps-lernen-leicht-gemacht`,
        `https://magazin.sofatutor.com/schueler/die-4-besten-lernmethoden-fuer-die-schule/#Lerntipps`
      ]
    )
  ];



  getMethods() {
    return this.methods.slice();
  }

}
