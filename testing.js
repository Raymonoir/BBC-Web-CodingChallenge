class Testing 
{
    constructor()
    {

    }

    test1 ()
    {
        QUnit.test( "hello test", function( assert ) 
        {
            assert.ok( 1 == "1", "Passed!" );
        });
    }
}





var test = new Testing();
test.test1();
