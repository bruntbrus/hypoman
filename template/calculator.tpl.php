<? namespace hypoman; ?>
<form action="">
  <textarea class="focus" name="expression" rows="2" cols="40" title="uttryck" wrap="off"></textarea>
  <div class="buttons">
    <input type="button" name="compute" value="=" title="beräkna (skift+retur)" />
    <input type="button" name="clear" value="Rensa" />
    <input type="button" name="erase" value="Radera" />
    <input type="button" name="help" value="Hjälp" />
  </div>
  <textarea name="answer" rows="2" cols="40" title="svar" readonly="readonly" wrap="off"></textarea>
  <textarea name="memory" rows="5" cols="40" title="minne" readonly="readonly" wrap="off"></textarea>
</form>
<div class="help">
  <h2>Konstanter</h2>
  <table>
    <tr><th>answer</th><td>Senaste svaret.</td></tr>
    <tr><th>c     </th><td>Ljusets hastighet i vakuum.</td></tr>
    <tr><th>e     </th><td>Eulers konstant.</td></tr>
    <tr><th>false </th><td>Falskt.</td></tr>
    <tr><th>g     </th><td>Jordens gravitation.</td></tr>
    <tr><th>ln2   </th><td>Naturliga logaritmen av 2.</td></tr>
    <tr><th>ln10  </th><td>Naturliga logaritmen av 10.</td></tr>
    <tr><th>null  </th><td>Inget värde.</td></tr>
    <tr><th>phi   </th><td>Gyllene snittet.</td></tr>
    <tr><th>pi    </th><td>Gamla hederliga pi.</td></tr>
    <tr><th>sr2   </th><td>Roten ur 2.</td></tr>
    <tr><th>sr3   </th><td>Roten ur 3.</td></tr>
    <tr><th>true  </th><td>Sant.</td></tr>
  </table>
  <h2>Funktioner</h2>
  <table>
    <tr><th>abs(x)     </th><td>Absolutbelopp.</td></tr>
    <tr><th>abs2(x)    </th><td>Absolutbelopp i kvadrat.</td></tr>
    <tr><th>acos(x)    </th><td>Arcus cosinus.</td></tr>
    <tr><th>asin(x)    </th><td>Arcus sinus.</td></tr>
    <tr><th>atan(x)    </th><td>Arcus tangens.</td></tr>
    <tr><th>bool(x)    </th><td>Sant eller falskt värde.</td></tr>
    <tr><th>ceil(x)    </th><td>Avrundar x uppåt till heltal.</td></tr>
    <tr><th>cos(x)     </th><td>Cosinus.</td></tr>
    <tr><th>cos2(x)    </th><td>Cosinus i kvadrat.</td></tr>
    <tr><th>cross(u,v) </th><td>Vektorprodukt.</td></tr>
    <tr><th>deg(x)     </th><td>Radianer till grader.</td></tr>
    <tr><th>dot(u,v)   </th><td>Skalärprodukt.</td></tr>
    <tr><th>exp(x)     </th><td>e upphöjt till x.</td></tr>
    <tr><th>fac(n)     </th><td>Fakultet.</td></tr>
    <tr><th>floor(x)   </th><td>Avrundar x nedåt till heltal.</td></tr>
    <tr><th>log(x)     </th><td>Naturlig logaritm.</td></tr>
    <tr><th>log2(x)    </th><td>Logaritm med basen 2.</td></tr>
    <tr><th>log10(x)   </th><td>Logaritm med basen 10.</td></tr>
    <tr><th>logb(b,x)  </th><td>Logaritm med basen b.</td></tr>
    <tr><th>max(...)   </th><td>Största värde.</td></tr>
    <tr><th>mean(...)  </th><td>Medelvärde.</td></tr>
    <tr><th>min(...)   </th><td>Minsta värde.</td></tr>
    <tr><th>num(x)     </th><td>Talvärde.</td></tr>
    <tr><th>pow(x,y)   </th><td>x upphöjt till y.</td></tr>
    <tr><th>qbrt(x)    </th><td>Kubikroten ur x.</td></tr>
    <tr><th>rad(x)     </th><td>Grader till radianer.</td></tr>
    <tr><th>rnd()      </th><td>Slumpmässigt tal mellan 0 och 1.</td></tr>
    <tr><th>rndint(a,b)</th><td>Slumpmässigt heltal från a till b.</td></tr>
    <tr><th>round(x,d) </th><td>Avrundar x till d decimaler.</td></tr>
    <tr><th>sin(x)     </th><td>Sinus.</td></tr>
    <tr><th>sin2(x)    </th><td>Sinus i kvadrat.</td></tr>
    <tr><th>sqrt(x)    </th><td>Roten ur x.</td></tr>
    <tr><th>str(x)     </th><td>Strängvärde.</td></tr>
    <tr><th>tan(x)     </th><td>Tangens.</td></tr>
  </table>
</div>