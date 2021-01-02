# white-box-vtt
White Box - Fantastic Medieval Adventures Game

The system is "as is" since the developer is not playing any White Box games at the moment.

Mostly everything is rollable directly from them sheets but here are some macros you can also utilize if you want :

## Roll X in 6
```game.whitebox.RollDialog.prepareDialog({tn:1, label:'My Roll'})```

## Roll to Hit dialog
```game.whitebox.RollDialog.prepareToHitDialog({tn:null, thb:0, mod:0 , label:'ROLL 1d20 TO HIT'})```

## Roll 1d20 with a modifier
```game.whitebox.RollDialog.prepareRolld20({label:'Roll d20', mod_show:true, mod_label:'Modifier: ', 'title':'Roll 1d20'});```

## Roll Morale
```game.whitebox.RollDialog.prepareDialog({num:2, tn:10, label:'Morale Roll', title:'Morale Roll', visible:false})```
